import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLearning } from '../context/LearningContext'
import GridMap from '../components/GridMap'
import SimulationControls from '../components/SimulationControls'
import toast from 'react-hot-toast'

const Simulator = () => {
  const { state, actions } = useLearning()
  const { simulation, grid } = state

  useEffect(() => {
    let interval
    
    if (simulation.isRunning) {
      interval = setInterval(async () => {
        try {
          const result = await actions.simulateNextStep()
          
          if (result.isGoalReached) {
            actions.stopSimulation()
            toast.success('🎉 Goal reached! Congratulations!')
          }
        } catch (error) {
          console.error('Simulation step failed:', error)
          actions.stopSimulation()
          toast.error('Simulation encountered an error')
        }
      }, simulation.speed || 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [simulation.isRunning, simulation.speed, actions])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI Learning Path Simulator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Watch as our DQN agent intelligently navigates through the learning landscape, 
          discovering optimal paths to reach educational goals while exploring valuable resources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Learning Grid</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Grid Size: {grid.size.x} × {grid.size.y}</span>
                <span>•</span>
                <span>Resources: {grid.resources.length}</span>
              </div>
            </div>
            
            <GridMap showAnimation={true} cellSize={16} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SimulationControls />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${
                  simulation.isRunning ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {simulation.isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Position:</span>
                <span className="text-sm font-medium text-gray-900">
                  ({grid.agentPosition[0]}, {grid.agentPosition[1]})
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Goal Position:</span>
                <span className="text-sm font-medium text-gray-900">
                  ({grid.goalPosition[0]}, {grid.goalPosition[1]})
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Path Length:</span>
                <span className="text-sm font-medium text-gray-900">
                  {grid.currentPath.length} steps
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>The DQN agent uses deep reinforcement learning to make optimal decisions</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Each step considers the current state and predicts the best action</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Learning resources provide rewards and influence path selection</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>The goal is to reach the target while maximizing learning value</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Simulator