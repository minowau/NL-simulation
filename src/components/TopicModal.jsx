import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Play, FileText, ExternalLink } from 'lucide-react'

const TopicModal = ({ topic, isOpen, onClose }) => {
  if (!topic) return null

  const getTopicIcon = (type) => {
    switch (type) {
      case 'concept': return <BookOpen className="w-5 h-5 text-blue-600" />
      case 'problem': return <FileText className="w-5 h-5 text-orange-600" />
      case 'technique': return <Play className="w-5 h-5 text-green-600" />
      case 'algorithm': return <FileText className="w-5 h-5 text-purple-600" />
      default: return <BookOpen className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'concept': return 'bg-blue-100 text-blue-800'
      case 'problem': return 'bg-orange-100 text-orange-800'
      case 'technique': return 'bg-green-100 text-green-800'
      case 'algorithm': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getTopicIcon(topic.type)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{topic.name}</h2>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(topic.type)}`}>
                    {topic.type}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {getTopicDescription(topic.name)}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Resources</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Video Lecture</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Reading Material</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Practice Problems</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 btn-primary">
                  Start Learning
                </button>
                <button className="flex-1 btn-secondary">
                  Add to Favorites
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Helper function to generate topic descriptions
const getTopicDescription = (topicName) => {
  const descriptions = {
    "Introduction to Mathematical Logic": "Fundamental concepts of mathematical logic including propositions, logical operators, and truth tables.",
    "Logical Equivalence": "Understanding when two logical statements are equivalent and methods to prove equivalence.",
    "SAT Problem": "The Boolean satisfiability problem and its significance in computational complexity theory.",
    "Rules of Inference": "Formal rules for deriving conclusions from premises in logical arguments.",
    "Resolution": "A rule of inference leading to a refutation-complete theorem-proving technique.",
    "Predicate Logic": "Extension of propositional logic using predicates, quantifiers, and variables.",
    "Sets": "Basic set theory including operations, relations, and fundamental properties.",
    "Relations": "Mathematical relations between elements of sets and their properties.",
    "Operations on Relations": "Composition, inverse, and other operations that can be performed on relations."
  }
  
  return descriptions[topicName] || "Explore this important topic in your learning journey. Click on the resources below to dive deeper into the subject matter."
}

export default TopicModal