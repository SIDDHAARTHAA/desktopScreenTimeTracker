export interface AppTrackingData {
  [appName: string]: number; // appName -> time in milliseconds
}

export interface TrackingData {
  today: AppTrackingData;
  thisWeek: AppTrackingData;
  currentSession: AppTrackingData;
}

export interface ElectronAPI {
  getTrackingData: () => Promise<TrackingData>;
  toggleTracking: () => Promise<{ isTracking: boolean }>;
  getTrackingStatus: () => Promise<{ isTracking: boolean }>;
  onTrackingUpdate: (callback: (data: TrackingData) => void) => void;
  removeTrackingUpdateListener: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
