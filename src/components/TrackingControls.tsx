import React from 'react'

interface TrackingControlsProps {
  isTracking: boolean
  onStart: () => void
  onStop: () => void
}

const TrackingControls: React.FC<TrackingControlsProps> = ({
  isTracking,
  onStart,
  onStop
}) => {
  return (
    <div className="card text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Tracking Controls
      </h2>
      
      <div className="flex items-center justify-center space-x-4">
        {!isTracking ? (
          <button
            onClick={onStart}
            className="btn-primary flex items-center space-x-2"
          >
            <span>▶️</span>
            <span>Start Tracking</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="btn-secondary flex items-center space-x-2"
          >
            <span>⏹️</span>
            <span>Stop Tracking</span>
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isTracking 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isTracking ? 'bg-green-500' : 'bg-gray-500'
          }`}></div>
          {isTracking ? 'Tracking Active' : 'Not Tracking'}
        </div>
      </div>
    </div>
  )
}

export default TrackingControls
