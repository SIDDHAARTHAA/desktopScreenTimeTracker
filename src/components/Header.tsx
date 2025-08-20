import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⏱️</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Screen Time Tracker</h1>
          </div>
          
          <div className="text-sm text-gray-500">
            v1.0.0
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
