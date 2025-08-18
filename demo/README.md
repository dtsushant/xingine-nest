# Xingine NestJS Demo - Real-Time Development Setup

This demo includes comprehensive real-time development integration that automatically rebuilds and reloads when changes are made to the xingine framework or xingine-nest package.

## 🚀 Quick Start

### Option 1: One-Command Development (Recommended)
```bash
npm run dev:realtime
```
This starts all necessary watchers and the NestJS server in one command.

### Option 2: Windows Batch File
```bash
start-dev.bat
```
Interactive batch file that explains what will be started.

### Option 3: Separate Components
```bash
# Terminal 1: Watch xingine core
npm run watch:xingine

# Terminal 2: Watch xingine-nest
npm run watch:xingine-nest  

# Terminal 3: Start NestJS server
npm run start:dev
```

## 📦 Development Scripts

- `dev:realtime` - Complete real-time development environment
- `dev:hot` - Hot reload with package watching
- `watch:packages` - Watch both xingine packages
- `watch:xingine` - Watch only xingine core package
- `watch:xingine-nest` - Watch only xingine-nest package
- `reset:dev` - Clean yalc cache and reinstall packages
- `clean:yalc` - Remove all yalc packages

## 🔄 How Real-Time Integration Works

1. **File Watching**: Nodemon watches source files in both packages
2. **Auto Build**: TypeScript compilation triggers on file changes
3. **Package Push**: Yalc automatically pushes updated packages
4. **Server Restart**: NestJS automatically restarts when packages update
5. **Instant Feedback**: Changes appear immediately in the running application

## 🌐 Development URLs

- **API Server**: http://localhost:3001
- **Swagger Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

## 🧪 Testing the Integration

1. Start development: `npm run dev:realtime`
2. Make changes in `../../xingine/src/` files
3. Watch automatic rebuild and server restart
4. Make changes in `../src/` files (xingine-nest)
5. Watch automatic rebuild and server restart
6. Test API endpoints to verify changes

## 🔧 Troubleshooting

**If packages don't update:**
```bash
npm run reset:dev
```

**If server doesn't restart:**
```bash
npm run clean:yalc
npm run yalc:link
npm run dev:realtime
```

**Check yalc status:**
```bash
yalc installations show
```

## 📁 Project Structure

```
demo/
├── watch-and-serve.js      # Main development orchestrator
├── trigger-reload.js       # Force NestJS reload
├── start-dev.bat          # Windows batch starter
└── src/                   # Demo application source
    ├── app.module.ts      # Main application module
    ├── controllers/       # REST and Xingine controllers
    ├── services/          # Business logic services
    └── entities/          # Database entities
```

This setup ensures seamless development across the entire xingine ecosystem with immediate feedback for all changes.
