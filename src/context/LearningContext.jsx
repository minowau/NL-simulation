import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { learningAPI } from '../services/api'

const LearningContext = createContext()

const initialState = {
  user: {
    id: 'user_1',
    name: 'Learning Explorer',
    currentPosition: [0, 0],
    visitedNodes: new Set(),
    totalScore: 0,
    completedTopics: 0
  },
  grid: {
    size: { x: 0, y: 0 },
    resources: [],
    agentPosition: [0, 0],
    goalPosition: [0, 0],
    currentPath: [],
    isSimulating: false
  },
  simulation: {
    isRunning: false,
    speed: 1000,
    currentStep: 0,
    totalSteps: 0
  }
}

function learningReducer(state, action) {
  switch (action.type) {
    case 'SET_GRID_DATA':
      return {
        ...state,
        grid: {
          ...state.grid,
          ...action.payload
        }
      }
    
    case 'UPDATE_AGENT_POSITION':
      const newVisited = new Set(state.user.visitedNodes)
      newVisited.add(`${action.payload[0]},${action.payload[1]}`)
      
      return {
        ...state,
        grid: {
          ...state.grid,
          agentPosition: action.payload
        },
        user: {
          ...state.user,
          currentPosition: action.payload,
          visitedNodes: newVisited
        }
      }
    
    case 'SET_SIMULATION_STATE':
      return {
        ...state,
        simulation: {
          ...state.simulation,
          ...action.payload
        }
      }
    
    case 'ADD_TO_PATH':
      return {
        ...state,
        grid: {
          ...state.grid,
          currentPath: [...state.grid.currentPath, action.payload]
        }
      }
    
    case 'CLEAR_PATH':
      return {
        ...state,
        grid: {
          ...state.grid,
          currentPath: []
        }
      }
    
    case 'UPDATE_USER_SCORE':
      return {
        ...state,
        user: {
          ...state.user,
          totalScore: state.user.totalScore + action.payload,
          completedTopics: state.user.completedTopics + 1
        }
      }
    
    default:
      return state
  }
}

export function LearningProvider({ children }) {
  const [state, dispatch] = useReducer(learningReducer, initialState)

  useEffect(() => {
    // Load initial grid data
    loadGridData()
  }, [])

  const loadGridData = async () => {
    try {
      const gridData = await learningAPI.getResourceGrid()
      dispatch({
        type: 'SET_GRID_DATA',
        payload: gridData
      })
    } catch (error) {
      console.error('Failed to load grid data:', error)
    }
  }

  const simulateNextStep = async () => {
    try {
      const response = await learningAPI.simulateStep({
        currentPosition: state.grid.agentPosition,
        goalPosition: state.grid.goalPosition
      })
      
      dispatch({
        type: 'UPDATE_AGENT_POSITION',
        payload: response.nextPosition
      })
      
      dispatch({
        type: 'ADD_TO_PATH',
        payload: response.nextPosition
      })
      
      return response
    } catch (error) {
      console.error('Simulation step failed:', error)
      throw error
    }
  }

  const startSimulation = async () => {
    dispatch({
      type: 'SET_SIMULATION_STATE',
      payload: { isRunning: true, currentStep: 0 }
    })
  }

  const stopSimulation = () => {
    dispatch({
      type: 'SET_SIMULATION_STATE',
      payload: { isRunning: false }
    })
  }

  const resetSimulation = () => {
    dispatch({
      type: 'UPDATE_AGENT_POSITION',
      payload: [0, 0]
    })
    dispatch({ type: 'CLEAR_PATH' })
    dispatch({
      type: 'SET_SIMULATION_STATE',
      payload: { isRunning: false, currentStep: 0 }
    })
  }

  const value = {
    state,
    dispatch,
    actions: {
      simulateNextStep,
      startSimulation,
      stopSimulation,
      resetSimulation,
      loadGridData
    }
  }

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  )
}

export const useLearning = () => {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}