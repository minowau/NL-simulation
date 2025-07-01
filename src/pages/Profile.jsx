import React from 'react'
import { motion } from 'framer-motion'
import { User, Award, BookOpen, TrendingUp, Calendar, Target } from 'lucide-react'
import { useLearning } from '../context/LearningContext'
import ProgressChart from '../components/ProgressChart'

const Profile = () => {
  const { state } = useLearning()
  const { user, grid } = state

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Started your first learning simulation',
      icon: '🚀',
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Explorer',
      description: 'Visited 10 different learning topics',
      icon: '🗺️',
      earned: user.visitedNodes.size >= 10,
      date: user.visitedNodes.size >= 10 ? '2024-01-16' : null
    },
    {
      id: 3,
      title: 'Scholar',
      description: 'Completed 5 learning modules',
      icon: '🎓',
      earned: user.completedTopics >= 5,
      date: user.completedTopics >= 5 ? '2024-01-17' : null
    },
    {
      id: 4,
      title: 'Master Navigator',
      description: 'Reached the learning goal efficiently',
      icon: '🧭',
      earned: false,
      date: null
    }
  ]

  const learningStats = [
    {
      label: 'Total Learning Time',
      value: '24h 32m',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Topics Mastered',
      value: user.completedTopics,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Current Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Average Score',
      value: '87%',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-lg text-gray-600 mt-1">Learning Explorer</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {user.visitedNodes.size} topics explored
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {achievements.filter(a => a.earned).length} achievements
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{user.totalScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {learningStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.earned
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.earned ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-green-600 mt-1">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {achievement.earned && (
                  <div className="text-green-600">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ProgressChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Journey</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">Mathematical Logic</h3>
                <p className="text-sm text-gray-600">Currently exploring foundational concepts</p>
              </div>
            </div>
            <div className="text-sm font-medium text-blue-600">In Progress</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">Set Theory Basics</h3>
                <p className="text-sm text-gray-600">Completed with 92% score</p>
              </div>
            </div>
            <div className="text-sm font-medium text-green-600">Completed</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">Graph Theory</h3>
                <p className="text-sm text-gray-600">Recommended next topic</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">Upcoming</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile