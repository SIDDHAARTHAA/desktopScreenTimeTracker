#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Testing PowerShell Commands for App Detection\n');

// Test 1: Simple PowerShell command
console.log('Test 1: Simple PowerShell command');
try {
  const result1 = execSync('powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -ne \'\'} | Select-Object -First 1 ProcessName,MainWindowTitle | Format-List"', {
    encoding: 'utf8',
    timeout: 5000,
    shell: true
  });
  console.log('✅ Success:');
  console.log(result1);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Alternative PowerShell command
console.log('Test 2: Alternative PowerShell command');
try {
  const result2 = execSync('powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -ne \'\'} | Select-Object -First 1 ProcessName,MainWindowTitle"', {
    encoding: 'utf8',
    timeout: 5000,
    shell: true
  });
  console.log('✅ Success:');
  console.log(result2);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Tasklist command
console.log('Test 3: Tasklist command');
try {
  const result3 = execSync('tasklist /FO CSV /NH', {
    encoding: 'utf8',
    timeout: 5000
  });
  console.log('✅ Success (first 5 lines):');
  console.log(result3.split('\n').slice(0, 5).join('\n'));
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Check PowerShell version
console.log('Test 4: PowerShell version');
try {
  const result4 = execSync('powershell -Command "$PSVersionTable.PSVersion"', {
    encoding: 'utf8',
    timeout: 5000,
    shell: true
  });
  console.log('✅ PowerShell version:', result4.trim());
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Simple process list
console.log('Test 5: Simple process list');
try {
  const result5 = execSync('powershell -Command "Get-Process | Select-Object -First 3 ProcessName"', {
    encoding: 'utf8',
    timeout: 5000,
    shell: true
  });
  console.log('✅ Success:');
  console.log(result5);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 6: Get all processes with window titles, excluding system ones
console.log('Test 6: Get all processes with window titles (excluding system processes)');
try {
  const result6 = execSync('powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -ne \'\'} | Where-Object {$_.ProcessName -notmatch \'(System|svchost|electron|screen-time-tracker|node|conhost|csrss|winlogon|ApplicationFrameHost|explorer|dwm|ctfmon)\'} | Select-Object ProcessName,MainWindowTitle | Format-Table"', {
    encoding: 'utf8',
    timeout: 10000,
    shell: true
  });
  console.log('✅ Success:');
  console.log(result6);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 7: Windows API approach (simplified)
console.log('Test 7: Windows API approach (simplified)');
try {
  const result7 = execSync('powershell -Command "Add-Type -TypeDefinition \'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow(); [DllImport(\"user32.dll\")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId); } $hwnd = [Win32]::GetForegroundWindow(); $processId = 0; [Win32]::GetWindowThreadProcessId($hwnd, [ref]$processId); $process = Get-Process -Id $processId -ErrorAction SilentlyContinue; if ($process) { Write-Output $process.ProcessName }"', {
    encoding: 'utf8',
    timeout: 10000,
    shell: true
  });
  console.log('✅ Success:');
  console.log('Foreground process:', result7.trim());
} catch (error) {
  console.log('❌ Failed:', error.message);
}

console.log('\n🎯 Test completed. Check the output above for any errors.');
