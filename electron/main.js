const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// ── Paths ──────────────────────────────────────────────────────
const PROJECT_ROOT = path.join(__dirname, '..');
const RESOURCES_PATH = app.isPackaged ? process.resourcesPath : PROJECT_ROOT;
const EMULATOR_PATH = path.join(PROJECT_ROOT, 'emulator', 'index.html');
const MAME_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'mame.exe')
  : path.join(PROJECT_ROOT, 'mame.exe');

// ── Window ──────────────────────────────────────────────────────
let mainWindow;
let mameProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    minWidth: 720,
    minHeight: 540,
    title: 'IBM 5100 Ultimate Collection',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    show: false,
    icon: path.join(__dirname, 'icon.ico')
  });

  // Load the emulator
  mainWindow.loadFile(path.join(__dirname, '..', 'emulator', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Build menu
  const menu = Menu.buildFromTemplate(buildMenu());
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── Menu ────────────────────────────────────────────────────────
function buildMenu() {
  return [
    {
      label: 'IBM 5100',
      submenu: [
        {
          label: 'About IBM 5100 Ultimate',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About IBM 5100 Ultimate',
              message: 'IBM 5100 Ultimate Collection',
              detail: [
                'Version: ' + app.getVersion(),
                '',
                'Web-based IBM 5100 emulator with BASIC/APL interpreters.',
                'Includes MAME v0.287, AI bridge, and full documentation.',
                '',
                'Released September 1975 — The first portable computer.',
                'El Psy Kongroo.'
              ].join('\n')
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Emulator',
      submenu: [
        {
          label: 'Reload Emulator',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.loadFile(EMULATOR_PATH);
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Fullscreen',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        }
      ]
    },
    {
      label: 'MAME',
      submenu: [
        {
          label: 'Launch IBM 5100 (MAME)',
          accelerator: 'Ctrl+M',
          click: () => launchMAME('ibm5100')
        },
        {
          label: 'Launch IBM 5110 (MAME)',
          click: () => launchMAME('ibm5110')
        },
        { type: 'separator' },
        {
          label: 'Kill MAME Process',
          click: killMAME
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Open Documentation Folder',
          click: () => {
            shell.openPath(RESOURCES_PATH);
          }
        },
        {
          label: 'Open MAME Folder',
          click: () => {
            shell.openPath(path.dirname(MAME_PATH));
          }
        },
        { type: 'separator' },
        {
          label: 'Open Terminal Here',
          click: () => {
            shell.openPath(RESOURCES_PATH);
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Emulator Commands',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Emulator Commands',
              message: 'IBM 5100 Emulator Commands',
              detail: [
                'BASIC MODE:',
                '  <number> <code>   Add program line',
                '  RUN               Execute program',
                '  LIST              List program lines',
                '  NEW               Clear program',
                '  PRINT <expr>      Evaluate expression',
                '  GOTO <line>       Jump to line',
                '',
                'APL MODE:',
                '  MODE APL          Switch to APL',
                '  <expression>      Evaluate APL',
                '',
                'GENERAL:',
                '  HELP              Show help',
                '  INFO              System info',
                '  CLEAR             Clear terminal',
                '  TIME TRAVEL       🥚',
                '  OKABE             🥚'
              ].join('\n')
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Keyboard Shortcuts',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Keyboard Shortcuts',
              message: 'IBM 5100 Keyboard Shortcuts',
              detail: [
                'F5               Reload emulator',
                'F11              Toggle fullscreen',
                'F12              Dev tools',
                'Ctrl+M           Launch MAME IBM 5100',
                '',
                'In the emulator:',
                'Type HELP for available commands'
              ].join('\n')
            });
          }
        }
      ]
    }
  ];
}

// ── MAME Launcher ──────────────────────────────────────────────
function launchMAME(system) {
  killMAME();

  const mameExe = MAME_PATH;
  if (!fs.existsSync(mameExe)) {
    dialog.showErrorBox('MAME Not Found', `MAME executable not found at:\n${mameExe}`);
    return;
  }

  const args = [system, '-window', '-skip_gameinfo'];

  try {
    mameProcess = spawn(mameExe, args, {
      cwd: path.dirname(mameExe),
      stdio: 'ignore',
      detached: true
    });

    mameProcess.on('error', (err) => {
      dialog.showErrorBox('MAME Error', `Failed to launch MAME:\n${err.message}`);
      mameProcess = null;
    });

    mameProcess.on('exit', () => {
      mameProcess = null;
    });
  } catch (err) {
    dialog.showErrorBox('MAME Error', `Failed to launch MAME:\n${err.message}`);
  }
}

function killMAME() {
  if (!mameProcess) return;
  try {
    mameProcess.kill('SIGTERM');
  } catch {
    try {
      mameProcess.kill();
    } catch {
      // Process already dead
    }
  }
  mameProcess = null;
}

// ── IPC Handlers ────────────────────────────────────────────────
ipcMain.handle('open-docs', () => {
  shell.openPath(RESOURCES_PATH);
});

ipcMain.handle('launch-mame', (event, system) => {
  launchMAME(system || 'ibm5100');
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});

// ── App Lifecycle ──────────────────────────────────────────────
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  killMAME();
  app.quit();
});

app.on('before-quit', () => {
  killMAME();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
