import React from 'react'
import { Link } from 'react-router-dom'
import { Play, TrendingUp, BookOpen, Target } from 'lucide-react'
import { useLearning } from '../context/LearningContext'
import ProgressChart from '../components/ProgressChart'

const Dashboard = () => {
  const { state } = useLearning()
  const { user, grid } = state

  const stats = [
    {
      label: 'Topics Explored',
      value: user.visitedNodes.size,
      total: grid.resources.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Current Score',
      value: user.totalScore,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Completed Topics',
      value: user.completedTopics,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to AI Learning Path
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover your optimal learning journey through intelligent course navigation powered by deep reinforcement learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                  {stat.total && (
                    <span className="text-lg text-gray-500 ml-1">/ {stat.total}</span>
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/simulator"
                className="flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-600 rounded-lg">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Start Learning Simulation</h3>
                    <p className="text-sm text-gray-600">Let AI guide your learning path</p>
                  </div>
                </div>
                <div className="text-primary-600 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </Link>

              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Topics</h3>
                    <p className="text-sm text-gray-600">Explore available learning resources</p>
                  </div>
                </div>
                <div className="text-gray-600 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-600">Track your learning progress</p>
                  </div>
                </div>
                <div className="text-gray-600 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Completed "Introduction to Mathematical Logic"</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Started learning path simulation</p>
                  <p className="text-xs text-gray-600">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Achieved 85% score on Logic Quiz</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ProgressChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard