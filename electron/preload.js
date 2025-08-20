const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Get current tracking data
  getTrackingData: () => ipcRenderer.invoke('get-tracking-data'),
  
  // Toggle tracking on/off
  toggleTracking: () => ipcRenderer.invoke('toggle-tracking'),
  
  // Get current tracking status
  getTrackingStatus: () => ipcRenderer.invoke('get-tracking-status'),
  
  // Listen for real-time tracking updates
  onTrackingUpdate: (callback) => {
    ipcRenderer.on('tracking-update', (event, data) => callback(data));
  },
  
  // Remove tracking update listener
  removeTrackingUpdateListener: () => {
    ipcRenderer.removeAllListeners('tracking-update');
  }
});
