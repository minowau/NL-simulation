from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple, Optional, Dict, Any
import torch
import json
import numpy as np
from pathlib import Path

app = FastAPI(title="Learning Path API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load extracted data
with open("../extracted_data.json", "r") as f:
    extracted_data = json.load(f)

# Process resource data
SCALE = 100
resource_cells = []
for name, data in extracted_data.items():
    x = int(float(data['x_coordinate']) * SCALE)
    y = int(float(data['y_coordinate']) * SCALE)
    resource_cells.append((x, y, name))

# Normalize to (0, 0)
min_x = min(x for x, y, _ in resource_cells)
min_y = min(y for x, y, _ in resource_cells)
adjusted_resources = [(x - min_x, y - min_y, name) for x, y, name in resource_cells]

GRID_SIZE_X = max(x for x, y, _ in adjusted_resources) + 1
GRID_SIZE_Y = max(y for x, y, _ in adjusted_resources) + 1

# DQN Model
class DQN(torch.nn.Module):
    def __init__(self, state_size, action_size):
        super(DQN, self).__init__()
        self.fc1 = torch.nn.Linear(state_size, 128)
        self.relu = torch.nn.ReLU()
        self.fc2 = torch.nn.Linear(128, action_size)

    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
state_size = GRID_SIZE_X * GRID_SIZE_Y
action_size = 2  # 0: UP, 1: RIGHT

model = DQN(state_size, action_size).to(device)
try:
    model.load_state_dict(torch.load("../model1.pth", map_location=device))
    model.eval()
    print("Model loaded successfully")
except Exception as e:
    print(f"Warning: Could not load model - {e}")
    model = None

# Pydantic models
class SimulateStepRequest(BaseModel):
    currentPosition: List[int]
    goalPosition: List[int]

class SimulateStepResponse(BaseModel):
    nextPosition: List[int]
    action: str
    reward: float
    isGoalReached: bool

class ResourceGridResponse(BaseModel):
    size: Dict[str, int]
    resources: List[Dict[str, Any]]
    agentPosition: List[int]
    goalPosition: List[int]

class SimulatePathRequest(BaseModel):
    startPosition: List[int]
    goalPosition: List[int]

class SimulatePathResponse(BaseModel):
    path: List[List[int]]
    totalSteps: int

# Utility functions
def get_state(x: int, y: int) -> int:
    return y * GRID_SIZE_X + x

def get_topic_type(name: str) -> str:
    """Categorize topics based on their names"""
    name_lower = name.lower()
    if any(word in name_lower for word in ['algorithm', 'warshall']):
        return 'algorithm'
    elif any(word in name_lower for word in ['problem', 'sat']):
        return 'problem'
    elif any(word in name_lower for word in ['proof', 'strategy', 'technique', 'resolution', 'induction']):
        return 'technique'
    else:
        return 'concept'

# API Routes
@app.get("/")
async def root():
    return {"message": "Learning Path API is running"}

@app.get("/api/resource-grid", response_model=ResourceGridResponse)
async def get_resource_grid():
    """Get the learning resource grid data"""
    resources = []
    for x, y, name in adjusted_resources:
        resources.append({
            "x": x,
            "y": y,
            "name": name,
            "type": get_topic_type(name)
        })
    
    return ResourceGridResponse(
        size={"x": GRID_SIZE_X, "y": GRID_SIZE_Y},
        resources=resources,
        agentPosition=[0, 0],
        goalPosition=[GRID_SIZE_X - 1, GRID_SIZE_Y - 1]
    )

@app.post("/api/simulate-step", response_model=SimulateStepResponse)
async def simulate_step(request: SimulateStepRequest):
    """Simulate one step using the DQN model"""
    try:
        x, y = request.currentPosition
        goal_x, goal_y = request.goalPosition
        
        if model is None:
            # Fallback to simple pathfinding
            next_x, next_y = x, y
            if x < goal_x:
                next_x = x + 1
                action = "RIGHT"
            elif y < goal_y:
                next_y = y + 1
                action = "UP"
            else:
                action = "STAY"
        else:
            # Use DQN model
            state = get_state(x, y)
            state_tensor = torch.eye(state_size)[state].unsqueeze(0).to(device)
            
            with torch.no_grad():
                q_values = model(state_tensor)
                action_idx = torch.argmax(q_values).item()
            
            next_x, next_y = x, y
            if action_idx == 0 and y < GRID_SIZE_Y - 1:  # UP
                next_y = y + 1
                action = "UP"
            elif action_idx == 1 and x < GRID_SIZE_X - 1:  # RIGHT
                next_x = x + 1
                action = "RIGHT"
            else:
                action = "STAY"
        
        # Calculate reward (simple distance-based)
        current_distance = abs(x - goal_x) + abs(y - goal_y)
        new_distance = abs(next_x - goal_x) + abs(next_y - goal_y)
        reward = current_distance - new_distance
        
        # Check if resource is at this position
        for res_x, res_y, _ in adjusted_resources:
            if res_x == next_x and res_y == next_y:
                reward += 5  # Bonus for visiting a resource
                break
        
        is_goal_reached = (next_x == goal_x and next_y == goal_y)
        
        return SimulateStepResponse(
            nextPosition=[next_x, next_y],
            action=action,
            reward=reward,
            isGoalReached=is_goal_reached
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/api/simulate-path", response_model=SimulatePathResponse)
async def simulate_full_path(request: SimulatePathRequest):
    """Simulate a complete path from start to goal"""
    try:
        path = []
        x, y = request.startPosition
        goal_x, goal_y = request.goalPosition
        
        max_steps = 1000  # Prevent infinite loops
        steps = 0
        
        while (x != goal_x or y != goal_y) and steps < max_steps:
            if model is None:
                # Simple pathfinding
                if x < goal_x:
                    x += 1
                elif y < goal_y:
                    y += 1
            else:
                # Use DQN model
                state = get_state(x, y)
                state_tensor = torch.eye(state_size)[state].unsqueeze(0).to(device)
                
                with torch.no_grad():
                    q_values = model(state_tensor)
                    action_idx = torch.argmax(q_values).item()
                
                if action_idx == 0 and y < GRID_SIZE_Y - 1:  # UP
                    y += 1
                elif action_idx == 1 and x < GRID_SIZE_X - 1:  # RIGHT
                    x += 1
            
            path.append([x, y])
            steps += 1
        
        return SimulatePathResponse(
            path=path,
            totalSteps=len(path)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Path simulation failed: {str(e)}")

@app.post("/api/submit-feedback")
async def submit_feedback(feedback: Dict[str, Any]):
    """Submit user feedback for RLHF"""
    # In a real implementation, this would save to a database
    print(f"Received feedback: {feedback}")
    return {"status": "success", "message": "Feedback received"}

@app.get("/api/user-progress/{user_id}")
async def get_user_progress(user_id: str):
    """Get user progress data"""
    # Mock data - in real implementation, fetch from database
    return {
        "userId": user_id,
        "visitedNodes": [],
        "totalScore": 0,
        "completedTopics": 0,
        "currentPosition": [0, 0]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)