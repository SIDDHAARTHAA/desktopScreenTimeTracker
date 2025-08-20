import React from 'react'

interface TrackingStatusProps {
  isTracking: boolean
  onToggle: () => void
  onRefresh: () => void
  isLoading: boolean
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({
  isTracking,
  onToggle,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isTracking ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              App Tracking
            </h2>
            <p className="text-sm text-gray-500">
              {isTracking 
                ? 'Automatically tracking your app usage' 
                : 'Tracking is currently paused'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="btn-secondary flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
          
          <button
            onClick={onToggle}
            className={`flex items-center space-x-2 ${
              isTracking ? 'btn-secondary' : 'btn-primary'
            }`}
          >
            <span>{isTracking ? '⏸️' : '▶️'}</span>
            <span>{isTracking ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>
      
      {isTracking && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">ℹ️</span>
            <p className="text-sm text-green-700">
              The app is automatically tracking which applications you're using and how long you spend on each one. 
              Data is updated in real-time and saved locally on your computer.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackingStatus
