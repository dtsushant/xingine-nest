const { spawn } = require('child_process');
const { execSync } = require('child_process');

console.log('🔄 Starting NestJS development server with proper process cleanup...');

let nestProcess = null;

function killPortProcesses() {
  try {
    console.log('🧹 Cleaning up port 3001...');

    // Method 1: Use netstat to find and kill specific processes on port 3001
    try {
      const { execSync } = require('child_process');
      const output = execSync('netstat -ano | findstr :3001', { encoding: 'utf8', timeout: 5000 });

      if (output.trim()) {
        const lines = output.split('\n').filter(line => line.includes(':3001'));

        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];

          if (pid && !isNaN(pid) && pid !== process.pid.toString()) {
            try {
              execSync(`taskkill /pid ${pid} /F`, { stdio: 'ignore', timeout: 3000 });
              console.log(`✅ Killed process ${pid} using port 3001`);
            } catch (e) {
              // Process might already be dead
            }
          }
        }
      }
    } catch (e) {
      // No processes found on port 3001
    }

    // Wait a moment for processes to fully terminate
    setTimeout(() => {
      console.log('✅ Port cleanup completed');
    }, 1000);

  } catch (error) {
    console.log('✅ Port 3001 is available');
  }
}

function startNestProcess() {
  killPortProcesses();

  console.log('🚀 Starting NestJS with watch mode...');
  nestProcess = spawn('npx', ['nest', 'start', '--watch'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  });

  nestProcess.on('close', (code) => {
    if (code !== null && code !== 0) {
      console.log(`\n⚠️  NestJS process exited with code ${code}`);
      // Wait a moment and restart
      setTimeout(() => {
        console.log('🔄 Restarting NestJS...');
        startNestProcess();
      }, 2000);
    }
  });

  nestProcess.on('error', (error) => {
    console.error('❌ NestJS process error:', error);
    setTimeout(() => {
      console.log('🔄 Attempting to restart...');
      startNestProcess();
    }, 3000);
  });
}

function gracefulShutdown() {
  console.log('\n🛑 Shutting down development server...');

  if (nestProcess) {
    nestProcess.kill('SIGTERM');

    // Force kill if it doesn't shut down gracefully
    setTimeout(() => {
      if (nestProcess && !nestProcess.killed) {
        console.log('🔨 Force killing NestJS process...');
        nestProcess.kill('SIGKILL');
      }
    }, 5000);
  }

  killPortProcesses();

  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Windows-specific handling
if (process.platform === 'win32') {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('SIGINT', gracefulShutdown);
}

// Start the process
startNestProcess();

console.log('\n💡 Development server is running');
console.log('💡 Press Ctrl+C to stop the server');
