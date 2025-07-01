import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useLearning } from '../context/LearningContext'

const ProgressChart = () => {
  const { state } = useLearning()
  
  // Mock progress data - replace with real data from API
  const progressData = [
    { day: 'Mon', topics: 2, score: 85 },
    { day: 'Tue', topics: 3, score: 92 },
    { day: 'Wed', topics: 1, score: 78 },
    { day: 'Thu', topics: 4, score: 95 },
    { day: 'Fri', topics: 2, score: 88 },
    { day: 'Sat', topics: 3, score: 91 },
    { day: 'Sun', topics: 2, score: 87 },
  ]

  const topicTypeData = [
    { type: 'Concepts', count: 12, color: '#3b82f6' },
    { type: 'Problems', count: 8, color: '#f59e0b' },
    { type: 'Techniques', count: 6, color: '#22c55e' },
    { type: 'Algorithms', count: 4, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="topics" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topicTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {state.user.visitedNodes.size}
          </div>
          <div className="text-sm text-gray-600">Topics Explored</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {state.user.totalScore}
          </div>
          <div className="text-sm text-gray-600">Total Score</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressChart