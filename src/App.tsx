import React, { useState, useEffect } from 'react'
import AppTrackingDisplay from './components/AppTrackingDisplay'
import TrackingStatus from './components/TrackingStatus'
import Header from './components/Header'
import { TrackingData } from './types/electron'

function App() {
  const [trackingData, setTrackingData] = useState<TrackingData>({
    today: {},
    thisWeek: {},
    currentSession: {}
  })
  const [isTracking, setIsTracking] = useState(true)
  const [viewMode, setViewMode] = useState<'today' | 'thisWeek'>('today')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    loadTrackingData()
    loadTrackingStatus()
    
    // Set up real-time updates
    if (window.electronAPI) {
      window.electronAPI.onTrackingUpdate((data) => {
        setTrackingData(data)
        setIsLoading(false)
      })
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeTrackingUpdateListener()
      }
    }
  }, [])

  const loadTrackingData = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.getTrackingData()
        setTrackingData(data)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Failed to load tracking data:', error)
      setIsLoading(false)
    }
  }

  const loadTrackingStatus = async () => {
    try {
      if (window.electronAPI) {
        const status = await window.electronAPI.getTrackingStatus()
        setIsTracking(status.isTracking)
      }
    } catch (error) {
      console.error('Failed to load tracking status:', error)
    }
  }

  const handleToggleTracking = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.toggleTracking()
        setIsTracking(result.isTracking)
      }
    } catch (error) {
      console.error('Failed to toggle tracking:', error)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    loadTrackingData()
  }

  const currentData = viewMode === 'today' ? trackingData.today : trackingData.thisWeek

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Tracking Status */}
          <TrackingStatus
            isTracking={isTracking}
            onToggle={handleToggleTracking}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* View Toggle */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('today')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'today'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('thisWeek')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'thisWeek'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          {/* App Tracking Display */}
          <AppTrackingDisplay
            data={currentData}
            viewMode={viewMode}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  )
}

export default App

