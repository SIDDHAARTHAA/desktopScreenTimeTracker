const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let screenTimeData = {
  today: '0h 0m',
  thisWeek: '0h 0m',
  total: '0h 0m'
};

// Data file path for storing screen time data
const dataFilePath = path.join(app.getPath('userData'), 'screen-time-data.json');

// Enhanced logging
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  // Also log to file in development
  if (isDev) {
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'electron.log');
    fs.appendFileSync(logFile, logMessage + '\n');
  }
}

// Ensure user data directory exists
function ensureDataDirectory() {
  const userDataDir = app.getPath('userData');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
}

// Load screen time data from file
function loadScreenTimeData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      screenTimeData = JSON.parse(data);
      log('Screen time data loaded successfully');
    } else {
      log('No existing screen time data found, using defaults');
    }
  } catch (error) {
    log(`Error loading screen time data: ${error.message}`, 'error');
  }
}

// Save screen time data to file
function saveScreenTimeData() {
  try {
    ensureDataDirectory();
    fs.writeFileSync(dataFilePath, JSON.stringify(screenTimeData, null, 2));
    log('Screen time data saved successfully');
  } catch (error) {
    log(`Error saving screen time data: ${error.message}`, 'error');
  }
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
  if (isDev) {
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
    if (isDev) {
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
    if (isDev) {
      dialog.showErrorBox('Load Error', `Failed to load: ${errorDescription}`);
    }
  });

  // Handle page load success
  mainWindow.webContents.on('did-finish-load', () => {
    log('Page loaded successfully');
  });

  // Handle console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levels = ['', 'info', 'warn', 'error'];
    log(`Renderer [${levels[level]}]: ${message}`, levels[level] || 'info');
  });
}

// App event handlers
app.whenReady().then(() => {
  log('App is ready');
  ensureDataDirectory();
  loadScreenTimeData();
  createWindow();
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

// IPC handlers for screen time tracking
ipcMain.handle('get-screen-time', async () => {
  log('Getting screen time data');
  return screenTimeData;
});

ipcMain.handle('start-tracking', async () => {
  log('Starting screen time tracking');
  // TODO: Implement actual tracking logic
  return { success: true };
});

ipcMain.handle('stop-tracking', async () => {
  log('Stopping screen time tracking');
  // TODO: Implement actual tracking logic
  return { success: true };
});

// Handle app quit - save data
app.on('before-quit', () => {
  log('App quitting, saving data...');
  saveScreenTimeData();
});

// Handle window close - save data
app.on('window-all-closed', () => {
  saveScreenTimeData();
});

// Global error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  log(error.stack, 'error');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
});
