# AI Learning Path Simulator

An intelligent web application that uses Deep Q-Network (DQN) reinforcement learning to guide learners through optimal educational pathways. The system visualizes learning resources as an interactive grid and simulates AI-driven navigation to help students discover the most effective learning sequences.

## 🚀 Features

### Frontend (React + Vite)
- **Interactive Learning Grid**: Visual representation of learning topics and resources
- **Real-time Simulation**: Watch AI agents navigate through learning paths
- **Progress Tracking**: Monitor learning achievements and statistics
- **Topic Exploration**: Click on resources to view detailed information
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Backend (FastAPI + PyTorch)
- **DQN Model Integration**: Uses trained deep reinforcement learning models
- **RESTful API**: Clean endpoints for simulation and data retrieval
- **Real-time Path Planning**: Dynamic route calculation based on current state
- **Resource Management**: Handles learning resource data and metadata

## 🛠️ Technology Stack

**Frontend:**
- React 18 with Hooks
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Axios for API communication

**Backend:**
- FastAPI for high-performance API
- PyTorch for DQN model inference
- Pydantic for data validation
- CORS middleware for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- PyTorch

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
python start_server.py
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🎯 How It Works

1. **Grid Initialization**: Learning resources are positioned on a 2D grid based on extracted coordinate data
2. **DQN Agent**: A trained deep Q-network makes intelligent decisions about movement
3. **Path Optimization**: The agent learns to balance reaching goals with exploring valuable resources
4. **Real-time Visualization**: Users can watch the simulation unfold step-by-step
5. **Interactive Exploration**: Click on any resource to learn more about the topic

## 🔧 API Endpoints

- `GET /api/resource-grid` - Retrieve grid layout and resource positions
- `POST /api/simulate-step` - Execute one simulation step
- `POST /api/simulate-path` - Generate complete path from start to goal
- `POST /api/submit-feedback` - Submit user feedback for model improvement
- `GET /api/user-progress/{user_id}` - Fetch user learning progress

## 🎨 Key Components

### GridMap Component
Interactive visualization of the learning landscape with:
- Resource markers (📚)
- Agent position tracking
- Path visualization
- Hover tooltips
- Click interactions

### Simulation Controls
Real-time control panel featuring:
- Play/Pause simulation
- Step-by-step execution
- Speed adjustment
- Reset functionality
- Progress tracking

### Topic Modal
Detailed resource information including:
- Topic descriptions
- Learning materials
- Resource links
- Category classification

## 🚀 Future Enhancements

- **Multi-Agent Simulation**: Support for multiple learning paths simultaneously
- **RLHF Integration**: Reinforcement Learning with Human Feedback
- **Custom Goal Setting**: Allow instructors to define learning objectives
- **Advanced Analytics**: Detailed learning pattern analysis
- **Social Features**: Collaborative learning and path sharing
- **Mobile App**: Native mobile application
- **Integration APIs**: Connect with existing LMS platforms

## 📊 Model Information

The DQN models (`model1.pth`, `model2.pth`, `model3.pth`) are trained using:
- State space: Grid positions encoded as one-hot vectors
- Action space: Movement directions (UP, RIGHT)
- Reward function: Distance reduction + resource exploration bonuses
- Network architecture: 2-layer fully connected neural network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and AI/ML best practices
- Inspired by educational technology and adaptive learning systems
- Uses reinforcement learning principles for intelligent path planning