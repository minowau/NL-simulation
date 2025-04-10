import pygame
import torch
import torch.nn as nn
import json
import numpy as np

# --- Constants ---
CELL_SIZE = 20
SCALE = 100
WINDOW_PADDING = 50
FPS = 10

# --- Load JSON ---
with open("extracted_data.json", "r") as f:
    data = json.load(f)

resources = []
for _, v in data.items():
    x = int(float(v["x_coordinate"]) * SCALE)
    y = int(float(v["y_coordinate"]) * SCALE)
    resources.append((x, y))

GRID_SIZE = max(max(x, y) for x, y in resources) + 1
START_POS = (GRID_SIZE - 1, 0)
GOAL_POS = (0, GRID_SIZE - 1)

# --- DQN Model ---
class DQN(nn.Module):
    def __init__(self, state_size, action_size):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_size, 128)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(128, action_size)

    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

# --- Environment ---
class GridEnv:
    def __init__(self, resources):
        self.grid_size = GRID_SIZE
        self.resources = set(resources)
        self.reset()

    def reset(self):
        self.agent_pos = list(START_POS)
        return self._get_state()

    def step(self, action):
        if action == 0 and self.agent_pos[0] > 0:
            self.agent_pos[0] -= 1
        elif action == 1 and self.agent_pos[1] < self.grid_size - 1:
            self.agent_pos[1] += 1

        reward = 1.0 if tuple(self.agent_pos) in self.resources else -0.1
        done = tuple(self.agent_pos) == GOAL_POS
        return self._get_state(), reward, done

    def _get_state(self):
        return self.agent_pos[0] * self.grid_size + self.agent_pos[1]

# --- Load Model ---
state_size = GRID_SIZE * GRID_SIZE
action_size = 2
model = DQN(state_size, action_size)
model.load_state_dict(torch.load("NavigatedLearningDQN.pth", map_location=torch.device('cpu')))
model.eval()

# --- Initialize Pygame ---
pygame.init()
win_size = GRID_SIZE * CELL_SIZE + 2 * WINDOW_PADDING
win = pygame.display.set_mode((win_size, win_size))
pygame.display.set_caption("DQN Grid Simulation")
clock = pygame.time.Clock()

# --- Colors ---
WHITE = (255, 255, 255)
GRAY = (200, 200, 200)
YELLOW = (255, 255, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
RED = (255, 0, 0)
BLACK = (0, 0, 0)

# --- Rendering ---
def draw_grid(agent_pos, path):
    win.fill(WHITE)
    font = pygame.font.SysFont(None, 18)

    # Draw grid cells and elements
    for x in range(GRID_SIZE):
        for y in range(GRID_SIZE):
            rect = pygame.Rect(y * CELL_SIZE + WINDOW_PADDING, x * CELL_SIZE + WINDOW_PADDING, CELL_SIZE, CELL_SIZE)
            pygame.draw.rect(win, GRAY, rect, 1)

            # Resource cell
            if (x, y) in resources:
                pygame.draw.rect(win, YELLOW, rect)

            # Path
            if (x, y) in path:
                pygame.draw.rect(win, GREEN, rect)

    # Draw agent
    ax, ay = agent_pos
    rect = pygame.Rect(ay * CELL_SIZE + WINDOW_PADDING, ax * CELL_SIZE + WINDOW_PADDING, CELL_SIZE, CELL_SIZE)
    pygame.draw.rect(win, BLUE, rect)

    # Draw goal
    gx, gy = GOAL_POS
    rect = pygame.Rect(gy * CELL_SIZE + WINDOW_PADDING, gx * CELL_SIZE + WINDOW_PADDING, CELL_SIZE, CELL_SIZE)
    pygame.draw.rect(win, RED, rect)

    # Axis Labels
    for i in range(GRID_SIZE):
        # Y-axis labels (rows)
        y_label = font.render(str(i), True, BLACK)
        win.blit(y_label, (WINDOW_PADDING - 15, i * CELL_SIZE + WINDOW_PADDING + CELL_SIZE // 3))

        # X-axis labels (columns)
        x_label = font.render(str(i), True, BLACK)
        win.blit(x_label, (i * CELL_SIZE + WINDOW_PADDING + CELL_SIZE // 3, WINDOW_PADDING - 20))

    pygame.display.update()

# --- Run Simulation ---
env = GridEnv(resources)
state = env.reset()
done = False
path = [tuple(env.agent_pos)]
steps = 0

while not done and steps < 2 * GRID_SIZE:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()

    state_tensor = torch.eye(state_size)[state].unsqueeze(0)
    q_vals = model(state_tensor)
    action = torch.argmax(q_vals).item()

    state, _, done = env.step(action)
    path.append(tuple(env.agent_pos))

    draw_grid(env.agent_pos, path)
    clock.tick(FPS)
    steps += 1

# --- Keep window open after done ---
done_displayed = True
while done_displayed:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done_displayed = False

pygame.quit()