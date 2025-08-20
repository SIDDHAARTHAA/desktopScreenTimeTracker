export interface ElectronAPI {
  getScreenTime: () => Promise<{
    today: string
    thisWeek: string
    total: string
  }>
  startTracking: () => Promise<{ success: boolean }>
  stopTracking: () => Promise<{ success: boolean }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
