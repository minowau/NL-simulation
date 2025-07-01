import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Target, User, MapPin } from 'lucide-react'
import { useLearning } from '../context/LearningContext'
import TopicModal from './TopicModal'

const GridMap = ({ showAnimation = true, cellSize = 20 }) => {
  const { state } = useLearning()
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [hoveredCell, setHoveredCell] = useState(null)
  
  const { grid, user } = state
  const { size, resources, agentPosition, goalPosition, currentPath } = grid

  const getCellContent = (x, y) => {
    const resource = resources.find(r => r.x === x && r.y === y)
    const isAgent = agentPosition[0] === x && agentPosition[1] === y
    const isGoal = goalPosition[0] === x && goalPosition[1] === y
    const isPath = currentPath.some(([px, py]) => px === x && py === y)
    const isVisited = user.visitedNodes.has(`${x},${y}`)

    return { resource, isAgent, isGoal, isPath, isVisited }
  }

  const getCellClassName = (x, y) => {
    const { resource, isAgent, isGoal, isPath, isVisited } = getCellContent(x, y)
    
    let baseClass = 'grid-cell relative flex items-center justify-center text-xs font-medium'
    
    if (isAgent) return `${baseClass} grid-cell-agent text-white`
    if (isGoal) return `${baseClass} grid-cell-goal text-white`
    if (resource) return `${baseClass} grid-cell-resource text-blue-700`
    if (isPath) return `${baseClass} grid-cell-path text-green-700`
    if (isVisited) return `${baseClass} bg-gray-100 text-gray-600`
    
    return `${baseClass} bg-white text-gray-400 hover:bg-gray-50`
  }

  const handleCellClick = (x, y) => {
    const { resource } = getCellContent(x, y)
    if (resource) {
      setSelectedTopic(resource)
    }
  }

  const renderCellIcon = (x, y) => {
    const { resource, isAgent, isGoal, isPath } = getCellContent(x, y)
    
    if (isAgent) return <User className="w-3 h-3" />
    if (isGoal) return <Target className="w-3 h-3" />
    if (resource) return <BookOpen className="w-3 h-3" />
    if (isPath) return <MapPin className="w-2 h-2" />
    
    return null
  }

  // Create a smaller, more manageable grid for display
  const displayGrid = React.useMemo(() => {
    const maxDisplaySize = 30
    const stepX = Math.max(1, Math.floor(size.x / maxDisplaySize))
    const stepY = Math.max(1, Math.floor(size.y / maxDisplaySize))
    
    const displayResources = resources.map(r => ({
      ...r,
      x: Math.floor(r.x / stepX),
      y: Math.floor(r.y / stepY)
    }))
    
    return {
      width: Math.min(size.x, maxDisplaySize),
      height: Math.min(size.y, maxDisplaySize),
      resources: displayResources,
      agentPos: [Math.floor(agentPosition[0] / stepX), Math.floor(agentPosition[1] / stepY)],
      goalPos: [Math.floor(goalPosition[0] / stepX), Math.floor(goalPosition[1] / stepY)],
      pathPoints: currentPath.map(([x, y]) => [Math.floor(x / stepX), Math.floor(y / stepY)])
    }
  }, [size, resources, agentPosition, goalPosition, currentPath])

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span>Current Position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Learning Resources</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Goal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Path Taken</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Progress: {user.visitedNodes.size} / {resources.length} topics explored
        </div>
      </div>

      <div 
        className="grid gap-1 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 overflow-auto max-h-96"
        style={{
          gridTemplateColumns: `repeat(${displayGrid.width}, minmax(${cellSize}px, 1fr))`,
          maxWidth: '100%'
        }}
      >
        {Array.from({ length: displayGrid.height }, (_, y) =>
          Array.from({ length: displayGrid.width }, (_, x) => {
            const cellKey = `${x}-${y}`
            const adjustedY = displayGrid.height - 1 - y // Flip Y coordinate for display
            
            return (
              <motion.div
                key={cellKey}
                className={getCellClassName(x, adjustedY)}
                style={{ 
                  width: `${cellSize}px`, 
                  height: `${cellSize}px`,
                  minWidth: `${cellSize}px`,
                  minHeight: `${cellSize}px`
                }}
                onClick={() => handleCellClick(x, adjustedY)}
                onMouseEnter={() => setHoveredCell({ x, y: adjustedY })}
                onMouseLeave={() => setHoveredCell(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={showAnimation ? { opacity: 0, scale: 0.8 } : {}}
                animate={showAnimation ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.2,
                  delay: showAnimation ? (x + y) * 0.01 : 0
                }}
              >
                {renderCellIcon(x, adjustedY)}
                
                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredCell?.x === x && hoveredCell?.y === adjustedY && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10"
                    >
                      {(() => {
                        const { resource, isAgent, isGoal } = getCellContent(x, adjustedY)
                        if (isAgent) return 'Current Position'
                        if (isGoal) return 'Learning Goal'
                        if (resource) return resource.name
                        return `Cell (${x}, ${adjustedY})`
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>

      <TopicModal
        topic={selectedTopic}
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  )
}

export default GridMap