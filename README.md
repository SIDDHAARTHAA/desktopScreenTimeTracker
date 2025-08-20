# Screen Time Tracker

A Windows desktop application built with Electron, React, and Tailwind CSS to track and monitor screen time usage.

## Features

- 🖥️ **Desktop App**: Native Windows application using Electron
- ⏱️ **Screen Time Tracking**: Monitor daily, weekly, and total screen time
- 🎨 **Modern UI**: Beautiful interface built with React and Tailwind CSS
- 📊 **Real-time Updates**: Live tracking with start/stop controls
- 🔒 **Secure**: Uses Electron's contextIsolation for security
- 💾 **Local Storage**: Data stored locally in file system

## Tech Stack

- **Backend**: Electron 28.1.0 (Main Process)
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
screen-time-tracker/
├── electron/           # Electron main process files
│   ├── main.js        # Main process entry point
│   └── preload.js     # Preload script for security
├── src/               # React frontend source code
│   ├── components/    # React components
│   ├── types/         # TypeScript type definitions
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
   cd screen-time-tracker
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
   - Launch Electron when the dev server is ready
   - Open the app in development mode

### Available Scripts

- `npm start` - Start development mode (React + Electron)
- `npm run dev` - Start only React dev server
- `npm run dev:simple` - Alternative development mode
- `npm run build` - Build React app for production
- `npm run build:electron` - Build and run Electron
- `npm run dist` - Build and package the app
- `npm run dist:win` - Build Windows installer
- `npm run clean` - Clean all build artifacts and dependencies

## Development

### Adding New Features

1. **Electron Backend**: Add new IPC handlers in `electron/main.js`
2. **Frontend**: Create new React components in `src/components/`
3. **Styling**: Use Tailwind CSS classes or extend in `tailwind.config.js`

### Screen Time Tracking Implementation

The current setup includes placeholder functions for screen time tracking. To implement actual tracking:

1. Modify the IPC handlers in `electron/main.js`
2. Add system monitoring logic (e.g., using Windows APIs)
3. Implement data persistence (currently using JSON files)
4. Add real-time updates to the frontend

### Data Storage

The app currently stores data in:
- **Location**: `%APPDATA%/screen-time-tracker/screen-time-data.json`
- **Format**: JSON with daily, weekly, and total tracking data
- **Persistence**: Automatic save on app close/quit

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
- Modify `electron/main.js` for window properties
- Change app metadata in `package.json`

## Security Features

- **Context Isolation**: Prevents direct access to Node.js APIs from renderer
- **Preload Script**: Safely exposes only necessary Electron APIs
- **No Node Integration**: Renderer process runs in isolated context
- **Web Security**: Enabled with secure defaults

## Troubleshooting

### Common Issues

1. **White screen appears**
   - Check if Vite dev server is running on port 3000
   - Look for errors in the console (F12 in Electron)
   - Check the logs in `logs/electron.log`

2. **Port 3000 already in use**
   - Close other applications using port 3000
   - Or change port in `vite.config.js`

3. **Electron won't start**
   - Ensure all dependencies are installed: `npm install`
   - Check Node.js version: `node --version`
   - Clear cache: `npm run clean && npm install`

4. **Build errors**
   - Clear build artifacts: `npm run clean`
   - Reinstall dependencies: `npm install`
   - Check TypeScript configuration

5. **App crashes on startup**
   - Check Windows Event Viewer for system errors
   - Ensure Windows 10/11 compatibility
   - Try running as administrator

### Debug Mode

The app includes comprehensive logging:
- **Console**: Check Electron console for detailed logs
- **File Logs**: Development logs saved to `logs/electron.log`
- **Dev Tools**: Press F12 in Electron for React DevTools

### Performance Issues

- **Memory**: Electron apps can use significant memory
- **CPU**: Check Task Manager for high CPU usage
- **Updates**: Keep Node.js and npm updated

## Windows 11 Compatibility

- ✅ **Tested on Windows 11 22H2**
- ✅ **Native Windows integration**
- ✅ **High DPI support**
- ✅ **Windows security features**
- ✅ **Modern UI components**

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

**Note**: This is a starter template with basic screen time tracking infrastructure. The actual tracking functionality needs to be implemented based on your specific requirements.
