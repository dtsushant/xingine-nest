const fs = require('fs');
const path = require('path');

// Trigger reload in the nest demo by touching main.ts
const demoMainPath = path.join(__dirname, 'demo', 'src', 'main.ts');

try {
  const now = new Date();
  if (fs.existsSync(demoMainPath)) {
    fs.utimesSync(demoMainPath, now, now);
    console.log('✅ Triggered NestJS demo reload by touching main.ts');
  } else {
    console.log('⚠️ Demo main.ts not found, manual reload may be needed');
  }
} catch (error) {
  console.log('⚠️ Could not touch demo main.ts, NestJS will restart on next file change');
}

console.log('🔄 xingine-nest reload trigger complete');
