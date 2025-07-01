import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Mock data for development - replace with actual API calls
const mockGridData = {
  size: { x: 50, y: 50 },
  resources: [
    { x: 19, y: 17, name: "Introduction to Mathematical Logic", type: "concept" },
    { x: 19, y: 18, name: "Logical Equivalence", type: "concept" },
    { x: 22, y: 18, name: "SAT Problem", type: "problem" },
    { x: 18, y: 17, name: "Rules of Inference", type: "concept" },
    { x: 18, y: 18, name: "Resolution", type: "technique" },
    { x: 20, y: 18, name: "Predicate Logic", type: "concept" },
    { x: 21, y: 17, name: "Rules of Inferences in Predicate Logic", type: "concept" },
    { x: 18, y: 18, name: "Proof Strategies I", type: "strategy" },
    { x: 18, y: 18, name: "Proof Strategies II", type: "strategy" },
    { x: 18, y: 18, name: "Induction", type: "technique" },
    { x: 19, y: 18, name: "Sets", type: "concept" },
    { x: 20, y: 18, name: "Relations", type: "concept" },
    { x: 18, y: 18, name: "Operations on Relations", type: "operation" },
    { x: 19, y: 18, name: "Transitive Closure of Relations", type: "concept" },
    { x: 17, y: 18, name: "Warshall's Algorithm for Computing Transitive Closure", type: "algorithm" }
  ],
  agentPosition: [0, 0],
  goalPosition: [49, 49]
}

export const learningAPI = {
  async getResourceGrid() {
    try {
      // const response = await api.get('/resource-grid')
      // return response.data
      
      // Mock response for development
      return mockGridData
    } catch (error) {
      console.error('API Error:', error)
      return mockGridData
    }
  },

  async simulateStep(data) {
    try {
      // const response = await api.post('/simulate-step', data)
      // return response.data
      
      // Mock simulation logic
      const [x, y] = data.currentPosition
      const [goalX, goalY] = data.goalPosition
      
      let nextX = x
      let nextY = y
      
      // Simple pathfinding logic
      if (x < goalX) nextX = x + 1
      else if (y < goalY) nextY = y + 1
      
      return {
        nextPosition: [nextX, nextY],
        action: nextX > x ? 'RIGHT' : 'UP',
        reward: 1,
        isGoalReached: nextX === goalX && nextY === goalY
      }
    } catch (error) {
      console.error('Simulation API Error:', error)
      throw error
    }
  },

  async simulateFullPath(data) {
    try {
      // const response = await api.post('/simulate-path', data)
      // return response.data
      
      // Mock full path simulation
      const path = []
      let [x, y] = data.startPosition
      const [goalX, goalY] = data.goalPosition
      
      while (x < goalX || y < goalY) {
        if (x < goalX) x++
        else if (y < goalY) y++
        path.push([x, y])
      }
      
      return { path, totalSteps: path.length }
    } catch (error) {
      console.error('Full path simulation error:', error)
      throw error
    }
  },

  async submitFeedback(data) {
    try {
      const response = await api.post('/submit-feedback', data)
      return response.data
    } catch (error) {
      console.error('Feedback submission error:', error)
      throw error
    }
  },

  async getUserProgress(userId) {
    try {
      const response = await api.get(`/user-progress/${userId}`)
      return response.data
    } catch (error) {
      console.error('User progress fetch error:', error)
      return { visitedNodes: [], totalScore: 0, completedTopics: 0 }
    }
  }
}