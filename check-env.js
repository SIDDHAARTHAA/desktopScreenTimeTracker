#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Check for Screen Time Tracker\n');

// Check Node.js
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js: ${nodeVersion}`);
    
    // Check if version is 18+
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    if (majorVersion < 18) {
        console.log(`⚠️  Warning: Node.js ${majorVersion} detected. Version 18+ recommended.`);
    }
} catch (error) {
    console.log('❌ Node.js: Not found or not in PATH');
    console.log('   Please install Node.js from https://nodejs.org/');
}

// Check npm
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
    console.log('❌ npm: Not found or not in PATH');
}

// Check project structure
console.log('\n📁 Project Structure:');
const requiredFiles = [
    'package.json',
    'electron/main.js',
    'electron/preload.js',
    'src/App.tsx',
    'vite.config.js',
    'tailwind.config.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - Missing`);
    }
});

// Check dependencies
console.log('\n📦 Dependencies:');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules directory exists');
    
    // Check key dependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const keyDeps = ['electron', 'react', 'vite', 'tailwindcss'];
    keyDeps.forEach(dep => {
        if (deps[dep]) {
            console.log(`✅ ${dep}: ${deps[dep]}`);
        } else {
            console.log(`❌ ${dep}: Not found in package.json`);
        }
    });
} else {
    console.log('❌ node_modules directory missing');
    console.log('   Run: npm install');
}

// Check Windows
console.log('\n🪟 Operating System:');
if (process.platform === 'win32') {
    console.log('✅ Windows detected');
    
    // Check Windows version
    try {
        const winVer = execSync('ver', { encoding: 'utf8' }).trim();
        console.log(`   Version: ${winVer}`);
    } catch (error) {
        console.log('   Version: Could not determine');
    }
} else {
    console.log(`⚠️  ${process.platform} detected (Windows recommended)`);
}

// Check ports
console.log('\n🌐 Port Availability:');
const net = require('net');
const testPort = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close();
            resolve(true);
        });
        server.on('error', () => {
            resolve(false);
        });
    });
};

testPort(3000).then(available => {
    if (available) {
        console.log('✅ Port 3000: Available');
    } else {
        console.log('❌ Port 3000: In use (may cause issues)');
    }
});

console.log('\n🚀 To start development:');
console.log('   npm start');
console.log('   or double-click start-dev.bat');
console.log('\n🧹 To clean and reinstall:');
console.log('   npm run clean && npm install');
