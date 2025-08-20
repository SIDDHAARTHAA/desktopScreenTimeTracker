import React from 'react'

interface ScreenTimeData {
  today: string
  thisWeek: string
  total: string
}

interface ScreenTimeDisplayProps {
  screenTime: ScreenTimeData
}

const ScreenTimeDisplay: React.FC<ScreenTimeDisplayProps> = ({ screenTime }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Screen Time */}
      <div className="card text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Today</h3>
        <p className="text-3xl font-bold text-blue-600">{screenTime.today}</p>
        <p className="text-sm text-gray-500 mt-2">Screen time today</p>
      </div>

      {/* This Week's Screen Time */}
      <div className="card text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
        <p className="text-3xl font-bold text-green-600">{screenTime.thisWeek}</p>
        <p className="text-sm text-gray-500 mt-2">Total this week</p>
      </div>

      {/* Total Screen Time */}
      <div className="card text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⏱️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total</h3>
        <p className="text-3xl font-bold text-purple-600">{screenTime.total}</p>
        <p className="text-sm text-gray-500 mt-2">All-time total</p>
      </div>
    </div>
  )
}

export default ScreenTimeDisplay
