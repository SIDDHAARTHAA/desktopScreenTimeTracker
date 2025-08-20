import React from 'react'
import { formatTime, getTotalTime, getTopApps, getTimePercentage } from '../utils/timeUtils'

interface AppTrackingDisplayProps {
  data: Record<string, number>
  viewMode: 'today' | 'thisWeek'
  isLoading: boolean
}

const AppTrackingDisplay: React.FC<AppTrackingDisplayProps> = ({
  data,
  viewMode,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tracking data...</p>
      </div>
    )
  }

  const totalTime = getTotalTime(data)
  const topApps = getTopApps(data, 20) // Show top 20 apps

  if (topApps.length === 0) {
    return (
      <div className="card text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📱</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No {viewMode === 'today' ? 'Today' : 'This Week'} Data
        </h3>
        <p className="text-gray-500">
          {viewMode === 'today' 
            ? 'No apps have been tracked today yet. Start using your computer to see data here.'
            : 'No apps have been tracked this week yet. Start using your computer to see data here.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {viewMode === 'today' ? 'Today' : 'This Week'} Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{formatTime(totalTime)}</p>
            <p className="text-sm text-gray-500">Total Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{topApps.length}</p>
            <p className="text-sm text-gray-500">Apps Used</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {topApps.length > 0 ? formatTime(topApps[0][1]) : '0m'}
            </p>
            <p className="text-sm text-gray-500">Most Used App</p>
          </div>
        </div>
      </div>

      {/* Apps List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          App Usage Details
        </h2>
        <div className="space-y-3">
          {topApps.map(([appName, time], index) => {
            const percentage = getTimePercentage(time, totalTime)
            const isTop3 = index < 3
            
            return (
              <div
                key={appName}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isTop3 ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isTop3 && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                  <div>
                    <h3 className={`font-medium ${
                      isTop3 ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {appName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {percentage}% of total time
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    isTop3 ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {formatTime(time)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AppTrackingDisplay
