# Fix: Node.js Works in CMD but Not in VS Code Terminal

## Problem
- ✅ Node.js v22.22.0 works in system CMD
- ❌ VS Code terminal shows "node is not recognized"

## Root Cause
VS Code terminal doesn't have the updated PATH environment variable that includes Node.js location.

## Solution Methods (Try in Order)

### Method 1: Restart VS Code Completely (EASIEST)

1. **Close VS Code completely**
   - File → Exit (or Alt + F4)
   - Make sure VS Code is fully closed

2. **Restart VS Code**
   - Open VS Code again
   - Open your project folder
   - Try `node --version` in terminal

### Method 2: Refresh VS Code Terminal

1. **Close all terminal tabs in VS Code**
   - Click the trash can icon on each terminal tab

2. **Open a new terminal**
   - Terminal → New Terminal (Ctrl + Shift + `)
   - Try `node --version`

### Method 3: Change VS Code Terminal to CMD (If PowerShell has issues)

1. **Open VS Code settings**
   - Press `Ctrl + ,` (comma)

2. **Search for "terminal default profile"**
   - Find "Terminal › Integrated › Default Profile: Windows"

3. **Change from PowerShell to Command Prompt**
   - Select "Command Prompt" instead of "PowerShell"

4. **Open new terminal and test**

### Method 4: Manually Add Node.js to PATH in VS Code

1. **Find Node.js installation path**
   - Usually: `C:\Program Files\nodejs\`
   - Or: `C:\Users\GOPAL\AppData\Roaming\npm\`

2. **Add to VS Code settings.json**
   - Press `Ctrl + Shift + P`
   - Type "Preferences: Open Settings (JSON)"
   - Add this configuration:

```json
{
    "terminal.integrated.env.windows": {
        "PATH": "${env:PATH};C:\\Program Files\\nodejs\\"
    }
}
```

### Method 5: System-Level PATH Check (If above don't work)

1. **Check system PATH variable**
   - Press `Win + R`, type `sysdm.cpl`
   - Advanced tab → Environment Variables
   - Check if Node.js path is in System PATH (not just User PATH)

2. **Add to System PATH if missing**
   - Edit System PATH variable
   - Add: `C:\Program Files\nodejs\`
   - Click OK, restart computer

## Quick Test Commands

After trying any method above:

```bash
# Test Node.js
node --version

# Test npm
npm --version

# If both work, install dependencies
npm install

# Run your project
npm run dev
```

## Alternative: Use Windows Terminal

If VS Code terminal keeps having issues:

1. **Install Windows Terminal** (from Microsoft Store)
2. **Use Windows Terminal** for running npm commands
3. **Keep VS Code open** for editing code

## Most Likely Solution

**Method 1 (Restart VS Code) should fix it 90% of the time!**

The PATH variable was updated when you installed Node.js, but VS Code was already running and didn't pick up the change.