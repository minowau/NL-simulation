import React from 'react'
import { Play, Pause, RotateCcw, FastForward, Settings } from 'lucide-react'
import { useLearning } from '../context/LearningContext'

const SimulationControls = () => {
  const { state, actions } = useLearning()
  const { simulation } = state

  const handleSpeedChange = (newSpeed) => {
    // Update simulation speed
    console.log('Speed changed to:', newSpeed)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Simulation Controls</h3>
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <select 
            className="text-sm border border-gray-300 rounded px-2 py-1"
            onChange={(e) => handleSpeedChange(e.target.value)}
            defaultValue="1000"
          >
            <option value="2000">Slow</option>
            <option value="1000">Normal</option>
            <option value="500">Fast</option>
            <option value="100">Very Fast</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {!simulation.isRunning ? (
          <button
            onClick={actions.startSimulation}
            className="flex items-center space-x-2 btn-primary"
          >
            <Play className="w-4 h-4" />
            <span>Start Simulation</span>
          </button>
        ) : (
          <button
            onClick={actions.stopSimulation}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={actions.simulateNextStep}
          disabled={simulation.isRunning}
          className="flex items-center space-x-2 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FastForward className="w-4 h-4" />
          <span>Next Step</span>
        </button>

        <button
          onClick={actions.resetSimulation}
          className="flex items-center space-x-2 btn-secondary"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{simulation.currentStep} / {simulation.totalSteps || '?'} steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: simulation.totalSteps 
                ? `${(simulation.currentStep / simulation.totalSteps) * 100}%` 
                : '0%' 
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SimulationControls