# App Usage Tracker

A Windows desktop application built with Electron, React, and Tailwind CSS that automatically tracks which applications you're using and how long you spend on each one.

## Features

- 🖥️ **Desktop App**: Native Windows application using Electron
- 📱 **Automatic App Tracking**: Monitors running applications in real-time
- ⚡ **Plug & Play**: Starts tracking immediately when you launch the app
- 📊 **Live Updates**: Real-time tracking with automatic data updates
- 🎯 **Focus Detection**: Tracks which app is currently in focus
- 💾 **Local Storage**: Data stored locally in file system
- 🔒 **Secure**: Uses Electron's contextIsolation for security
- 🎨 **Modern UI**: Beautiful interface built with React and Tailwind CSS

## Tech Stack

- **Backend**: Electron 28.1.0 (Main Process)
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
app-usage-tracker/
├── electron/           # Electron main process files
│   ├── main.js        # Main process with app tracking logic
│   └── preload.js     # Preload script for security
├── src/               # React frontend source code
│   ├── components/    # React components
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles with Tailwind
├── scripts/           # Development scripts
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── start-dev.bat      # Windows development starter
```

## Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)
- **Windows 10/11** (tested on Windows 11)

### Quick Start (Windows)

1. **Double-click `start-dev.bat`**
   - This will automatically check dependencies and start the app
   - No command line knowledge required!

### Manual Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd app-usage-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm start
   ```

   This will:
   - Start the Vite dev server for React
   - Launch Electron with automatic app tracking
   - Begin monitoring your app usage immediately

### Available Scripts

- `npm start` - Start development mode (React + Electron)
- `npm run dev` - Start only React dev server
- `npm run dev:simple` - Alternative development mode
- `npm run build` - Build React app for production
- `npm run build:electron` - Build and run Electron
- `npm run dist` - Build and package the app
- `npm run dist:win` - Build Windows installer
- `npm run clean` - Clean all build artifacts and dependencies

## How It Works

### Automatic Tracking
- **Immediate Start**: Tracking begins as soon as you launch the app
- **Focus Detection**: Monitors which application window is currently active
- **Real-time Updates**: Updates every second with current app usage
- **Smart Filtering**: Ignores system processes and the tracker itself

### Data Collection
- **App Names**: Records the names of applications you use
- **Usage Time**: Tracks how long you spend on each app
- **Session Data**: Maintains current session and daily/weekly totals
- **Local Storage**: All data stored locally on your computer

### Data Views
- **Today**: View your app usage for the current day
- **This Week**: View your app usage for the current week (Monday-Sunday)
- **Toggle Between**: Easily switch between daily and weekly views

## Development

### Adding New Features

1. **Electron Backend**: Add new IPC handlers in `electron/main.js`
2. **Frontend**: Create new React components in `src/components/`
3. **Styling**: Use Tailwind CSS classes or extend in `tailwind.config.js`

### App Tracking Implementation

The app uses Windows-specific APIs to detect:
- **Running Processes**: Uses `tasklist` command
- **Foreground Windows**: Uses PowerShell to detect active windows
- **Process Filtering**: Excludes system processes and the tracker itself

### Data Persistence

The app stores data in:
- **Location**: `%APPDATA%/app-usage-tracker/app-tracking-data.json`
- **Format**: JSON with daily, weekly, and session tracking data
- **Auto-save**: Data saved every 30 seconds and on app close

### Building for Distribution

```bash
# Build the React app
npm run build

# Package for Windows
npm run dist:win
```

The built installer will be available in the `dist-electron` folder.

## Customization

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use Tailwind utility classes in components

### App Configuration
- Update `package.json` build settings
- Modify `electron/main.js` for tracking behavior
- Change app metadata in `package.json`

### Tracking Behavior
- Modify `getCurrentApp()` function for different detection methods
- Adjust update intervals in `startTracking()`
- Customize data saving frequency

## Security Features

- **Context Isolation**: Prevents direct access to Node.js APIs from renderer
- **Preload Script**: Safely exposes only necessary Electron APIs
- **No Node Integration**: Renderer process runs in isolated context
- **Web Security**: Enabled with secure defaults
- **Local Data Only**: No data sent to external servers

## Troubleshooting

### Common Issues

1. **No apps showing up**
   - Check if tracking is enabled (green indicator)
   - Try refreshing the data
   - Check Windows permissions for process access

2. **App crashes on startup**
   - Check Windows Event Viewer for system errors
   - Ensure Windows 10/11 compatibility
   - Try running as administrator

3. **Tracking not working**
   - Check if the app has necessary permissions
   - Restart the app
   - Check logs in `logs/electron.log`

4. **Performance issues**
   - The app updates every second - this is normal
   - Check Task Manager for high CPU usage
   - Restart if needed

### Debug Mode

The app includes comprehensive logging:
- **Console**: Check Electron console for detailed logs
- **File Logs**: Development logs saved to `logs/electron.log`
- **Dev Tools**: Press F12 in Electron for React DevTools

## Windows 11 Compatibility

- ✅ **Tested on Windows 11 22H2**
- ✅ **Native Windows integration**
- ✅ **High DPI support**
- ✅ **Windows security features**
- ✅ **Modern UI components**
- ✅ **Process monitoring APIs**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Windows 11
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the logs in `logs/electron.log`
- Open an issue on GitHub with:
  - Windows version
  - Node.js version
  - Error logs
  - Steps to reproduce

---

**Note**: This app automatically tracks your application usage as soon as you launch it. No manual start/stop required - it's designed to be completely plug-and-play!
