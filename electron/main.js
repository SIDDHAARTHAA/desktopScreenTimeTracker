const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;
let isTracking = true; // Always tracking by default
let trackingData = {
  today: {},
  thisWeek: {},
  currentSession: {}
};
let currentApp = null;
let sessionStartTime = Date.now();
let lastUpdateTime = Date.now();

// Data file path for storing tracking data
const dataFilePath = path.join(app.getPath('userData'), 'app-tracking-data.json');

// Enhanced logging
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  // Also log to file in development
  if (process.env.NODE_ENV === 'development') {
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'electron.log');
    fs.appendFileSync(logFile, logMessage + '\n');
  }
}

// Get current focused application (Windows)
function getCurrentApp() {
  try {
    const { execSync } = require('child_process');
    const result = execSync('tasklist /FO CSV /NH', { encoding: 'utf8' });
    const lines = result.split('\n').filter(line => line.trim());
    
    // Get the foreground window process
    const foregroundResult = execSync('powershell "Get-Process | Where-Object {$_.MainWindowTitle -ne \"\"} | Select-Object ProcessName,MainWindowTitle | ConvertTo-CSV -NoTypeInformation"', { encoding: 'utf8' });
    const foregroundLines = foregroundResult.split('\n').filter(line => line.trim() && !line.includes('ProcessName'));
    
    if (foregroundLines.length > 0) {
      const processInfo = foregroundLines[0].split(',');
      if (processInfo.length >= 2) {
        const appName = processInfo[0].replace(/"/g, '').trim();
        const windowTitle = processInfo[1].replace(/"/g, '').trim();
        
        // Filter out system processes and our own app
        if (appName && 
            !appName.toLowerCase().includes('system') &&
            !appName.toLowerCase().includes('svchost') &&
            !appName.toLowerCase().includes('electron') &&
            !appName.toLowerCase().includes('screen-time-tracker') &&
            windowTitle) {
          return {
            name: appName,
            title: windowTitle,
            timestamp: Date.now()
          };
        }
      }
    }
    
    // Fallback: get the most recently used process
    const processes = lines.map(line => {
      const parts = line.split(',');
      if (parts.length >= 1) {
        const processName = parts[0].replace(/"/g, '').trim();
        if (processName && 
            !processName.toLowerCase().includes('system') &&
            !processName.toLowerCase().includes('svchost') &&
            !processName.toLowerCase().includes('electron') &&
            !processName.toLowerCase().includes('screen-time-tracker')) {
          return processName;
        }
      }
      return null;
    }).filter(Boolean);
    
    if (processes.length > 0) {
      return {
        name: processes[0],
        title: 'Unknown',
        timestamp: Date.now()
      };
    }
    
    return null;
  } catch (error) {
    log(`Error getting current app: ${error.message}`, 'error');
    return null;
  }
}

// Update tracking data
function updateTrackingData() {
  if (!isTracking) return;
  
  const now = Date.now();
  const timeDiff = now - lastUpdateTime;
  
  if (currentApp && timeDiff > 1000) { // Update every second
    const appName = currentApp.name;
    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart();
    
    // Update today's data
    if (!trackingData.today[today]) {
      trackingData.today[today] = {};
    }
    if (!trackingData.today[today][appName]) {
      trackingData.today[today][appName] = 0;
    }
    trackingData.today[today][appName] += timeDiff;
    
    // Update this week's data
    if (!trackingData.thisWeek[weekStart]) {
      trackingData.thisWeek[weekStart] = {};
    }
    if (!trackingData.thisWeek[weekStart][appName]) {
      trackingData.thisWeek[weekStart][appName] = 0;
    }
    trackingData.thisWeek[weekStart][appName] += timeDiff;
    
    // Update current session
    if (!trackingData.currentSession[appName]) {
      trackingData.currentSession[appName] = 0;
    }
    trackingData.currentSession[appName] += timeDiff;
    
    lastUpdateTime = now;
    
    // Send update to renderer
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tracking-update', {
        today: trackingData.today[today],
        thisWeek: trackingData.thisWeek[weekStart],
        currentSession: trackingData.currentSession
      });
    }
  }
}

// Get week start date (Monday)
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Format time in hours and minutes
function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Load tracking data from file
function loadTrackingData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      trackingData = JSON.parse(data);
      log('Tracking data loaded successfully');
    } else {
      log('No existing tracking data found, starting fresh');
    }
  } catch (error) {
    log(`Error loading tracking data: ${error.message}`, 'error');
  }
}

// Save tracking data to file
function saveTrackingData() {
  try {
    const userDataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(trackingData, null, 2));
    log('Tracking data saved successfully');
  } catch (error) {
    log(`Error saving tracking data: ${error.message}`, 'error');
  }
}

// Start tracking loop
function startTracking() {
  log('Starting automatic app tracking...');
  
  // Initial app detection
  currentApp = getCurrentApp();
  
  // Set up tracking interval
  setInterval(() => {
    const newApp = getCurrentApp();
    if (newApp && (!currentApp || newApp.name !== currentApp.name)) {
      log(`App focus changed: ${currentApp ? currentApp.name : 'None'} -> ${newApp.name}`);
      currentApp = newApp;
    }
    updateTrackingData();
  }, 1000);
  
  // Set up data saving interval
  setInterval(() => {
    saveTrackingData();
  }, 30000); // Save every 30 seconds
}

function createWindow() {
  log('Creating main window...');
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    show: false,
    titleBarStyle: 'default',
    autoHideMenuBar: false
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    log('Development mode: Loading from Vite dev server');
    const devUrl = 'http://localhost:3000';
    
    // Check if dev server is running
    const http = require('http');
    const checkDevServer = () => {
      const req = http.get(devUrl, (res) => {
        if (res.statusCode === 200) {
          log('Dev server is ready, loading app...');
          mainWindow.loadURL(devUrl);
          mainWindow.webContents.openDevTools();
        } else {
          log(`Dev server responded with status: ${res.statusCode}`, 'warn');
          setTimeout(checkDevServer, 1000);
        }
      });
      
      req.on('error', (err) => {
        log(`Dev server not ready: ${err.message}`, 'warn');
        setTimeout(checkDevServer, 1000);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        log('Dev server check timeout, retrying...', 'warn');
        setTimeout(checkDevServer, 1000);
      });
    };
    
    checkDevServer();
  } else {
    log('Production mode: Loading from built files');
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      log('Built files not found', 'error');
      dialog.showErrorBox('Build Error', 'Built files not found. Please run npm run build first.');
      app.quit();
      return;
    }
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    log('Window ready to show');
    mainWindow.show();
    if (process.env.NODE_ENV === 'development') {
      mainWindow.focus();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    log('Main window closed');
    mainWindow = null;
  });

  // Handle window errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    log(`Failed to load: ${validatedURL} - ${errorDescription} (${errorCode})`, 'error');
    if (process.env.NODE_ENV === 'development') {
      dialog.showErrorBox('Load Error', `Failed to load: ${errorDescription}`);
    }
  });

  // Handle page load success
  mainWindow.webContents.on('did-finish-load', () => {
    log('Page loaded successfully');
    // Send initial data to renderer
    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart();
    
    mainWindow.webContents.send('tracking-update', {
      today: trackingData.today[today] || {},
      thisWeek: trackingData.thisWeek[weekStart] || {},
      currentSession: trackingData.currentSession
    });
  });
}

// App event handlers
app.whenReady().then(() => {
  log('App is ready');
  loadTrackingData();
  createWindow();
  startTracking(); // Start tracking immediately
});

app.on('window-all-closed', () => {
  log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('get-tracking-data', async () => {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart();
  
  return {
    today: trackingData.today[today] || {},
    thisWeek: trackingData.thisWeek[weekStart] || {},
    currentSession: trackingData.currentSession
  };
});

ipcMain.handle('toggle-tracking', async () => {
  isTracking = !isTracking;
  log(`Tracking ${isTracking ? 'enabled' : 'disabled'}`);
  return { isTracking };
});

ipcMain.handle('get-tracking-status', async () => {
  return { isTracking };
});

// Handle app quit - save data
app.on('before-quit', () => {
  log('App quitting, saving data...');
  saveTrackingData();
});

// Global error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  log(error.stack, 'error');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
});
