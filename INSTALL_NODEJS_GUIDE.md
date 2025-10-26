# Fix: npm is not recognized - Node.js Installation Guide

## Problem
```
npm is not recognized as internal and external command
```

This happens because Node.js (which includes npm) is not installed on your Windows system.

## Solution: Install Node.js

### Method 1: Download from Official Website (RECOMMENDED)

1. **Go to Node.js official website:**
   - Visit: https://nodejs.org
   - Download the **LTS version** (Long Term Support) - currently Node.js 20.x

2. **Download the Windows Installer:**
   - Click "Download for Windows"
   - Choose the `.msi` file (Windows Installer)
   - File will be named something like `node-v20.x.x-x64.msi`

3. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **IMPORTANT**: Make sure "Add to PATH" is checked ✅
   - Click "Install" and wait for completion

4. **Restart Your Computer:**
   - This ensures the PATH environment variable is updated
   - Close all terminals and VS Code

### Method 2: Using Winget (Windows Package Manager)

If you have Windows 10/11 with winget:

```powershell
# Install Node.js using winget
winget install OpenJS.NodeJS
```

### Method 3: Using Chocolatey (If you have Chocolatey installed)

```powershell
# Install Node.js using Chocolatey
choco install nodejs
```

## Verification Steps

After installation and restart:

1. **Open a NEW PowerShell window**
2. **Check Node.js version:**
   ```powershell
   node --version
   ```
   Should show: `v20.x.x`

3. **Check npm version:**
   ```powershell
   npm --version
   ```
   Should show: `10.x.x`

## Then Run Your Project

Once Node.js is installed:

```powershell
# Navigate to your project
cd "C:\Users\GOPAL\Desktop\BinalShowcase"

# Install dependencies
npm install

# Run development server
npm run dev

# Or build and start production
npm run build
npm start
```

## Troubleshooting

### If still not recognized after installation:

1. **Restart your computer completely**
2. **Check PATH variable manually:**
   - Press `Win + R`, type `sysdm.cpl`
   - Go to "Advanced" tab → "Environment Variables"
   - Check if Node.js path is in system PATH

3. **Reinstall Node.js:**
   - Uninstall from Control Panel
   - Download fresh installer from nodejs.org
   - Reinstall with "Add to PATH" checked

### Alternative: Use Node.js Portable
If installation issues persist, download Node.js portable version and add to PATH manually.

## Next Steps After Installation

1. Install dependencies: `npm install`
2. Test development server: `npm run dev`
3. Build for production: `npm run build`
4. Deploy to hosting platform (Vercel, Railway, etc.)