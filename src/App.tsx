import React, { useState, useEffect } from 'react'
import ScreenTimeDisplay from './components/ScreenTimeDisplay'
import TrackingControls from './components/TrackingControls'
import Header from './components/Header'

interface ScreenTimeData {
  today: string
  thisWeek: string
  total: string
}

function App() {
  const [screenTime, setScreenTime] = useState<ScreenTimeData>({
    today: '0h 0m',
    thisWeek: '0h 0m',
    total: '0h 0m'
  })
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    // Load initial screen time data
    loadScreenTime()
  }, [])

  const loadScreenTime = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.getScreenTime()
        setScreenTime(data)
      }
    } catch (error) {
      console.error('Failed to load screen time:', error)
    }
  }

  const handleStartTracking = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.startTracking()
        setIsTracking(true)
      }
    } catch (error) {
      console.error('Failed to start tracking:', error)
    }
  }

  const handleStopTracking = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.stopTracking()
        setIsTracking(false)
        // Reload data after stopping
        loadScreenTime()
      }
    } catch (error) {
      console.error('Failed to stop tracking:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Screen Time Tracker
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monitor and manage your daily screen time usage. Track your productivity 
              and build healthier digital habits.
            </p>
          </div>

          {/* Tracking Controls */}
          <TrackingControls
            isTracking={isTracking}
            onStart={handleStartTracking}
            onStop={handleStopTracking}
          />

          {/* Screen Time Display */}
          <ScreenTimeDisplay screenTime={screenTime} />
        </div>
      </main>
    </div>
  )
}

export default App
