#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Screen Time Tracker in development mode...\n');

// Start Vite dev server
console.log('📡 Starting Vite dev server...');
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

// Wait a bit for Vite to start
setTimeout(() => {
  console.log('\n⚡ Starting Electron...');
  const electron = spawn('cross-env', ['NODE_ENV=development', 'electron', '.'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  electron.on('close', (code) => {
    console.log(`\n🔴 Electron process exited with code ${code}`);
    vite.kill();
    process.exit(code);
  });
}, 3000);

vite.on('close', (code) => {
  console.log(`\n🔴 Vite process exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  vite.kill();
  process.exit(0);
});
