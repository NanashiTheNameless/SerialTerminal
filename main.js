const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');

let mainWindow;

// (avoids BlueZ LL Privacy errors when BLE isn't needed)
app.commandLine.appendSwitch('disable-bluetooth');

function createWindow() {
  // Use platform-specific icon
  let iconPath;
  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'logo.ico');
  } else if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, 'logo.icns');
  } else {
    iconPath = path.join(__dirname, 'logo.png');
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Enable experimental features for WebSerial
      enableBlinkFeatures: 'Serial'
    }
  });

  // Load the web app
  mainWindow.loadURL('https://serial.namelessnanashi.dev');

  // Open DevTools in debug mode
  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools();
  }

  // Enable right-click context menu
  mainWindow.webContents.on('context-menu', (e, params) => {
    const { Menu, MenuItem } = require('electron');
    const menu = new Menu();

    // Add standard context menu items
    if (params.selectionText) {
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
    }
    
    if (params.editFlags.canPaste) {
      menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
    }
    
    if (params.editFlags.canCut) {
      menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
    }
    
    if (params.editFlags.canSelectAll) {
      if (menu.items.length > 0) {
        menu.append(new MenuItem({ type: 'separator' }));
      }
      menu.append(new MenuItem({ label: 'Select All', role: 'selectAll' }));
    }

    // Add developer tools option
    if (menu.items.length > 0) {
      menu.append(new MenuItem({ type: 'separator' }));
    }
    menu.append(new MenuItem({
      label: 'Inspect Element',
      click: () => {
        mainWindow.webContents.inspectElement(params.x, params.y);
      }
    }));

    menu.popup();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Grant serial port permissions
app.whenReady().then(() => {
  // Set a custom application menu (no Help tab)
  const isDebug = process.argv.includes('--debug');
  const appMenu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { role: 'quit', label: 'Quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        ...(isDebug ? [{ role: 'reload' }, { role: 'toggleDevTools' }, { type: 'separator' }] : []),
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ]);
  Menu.setApplicationMenu(appMenu);

  // Handle serial port selection - show custom Chromium-style picker
  session.defaultSession.on('select-serial-port', (event, portList, webContents, callback) => {
    event.preventDefault();
    
    if (!portList || portList.length === 0) {
      console.log('No serial ports available');
      callback('');
      return;
    }
    
    console.log('Available ports:', portList.map(p => p.portName || p.displayName));
    
    const { BrowserWindow, ipcMain } = require('electron');
    
    const pickerWindow = new BrowserWindow({
      width: 560,
      height: 520,
      minWidth: 520,
      minHeight: 420,
      useContentSize: true,
      resizable: true,
      frame: true,
      parent: mainWindow,
      modal: true,
      title: 'Select Serial Port',
      autoHideMenuBar: true,
      backgroundColor: '#2b2b2b',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    // Remove menu from the picker entirely (no Help tab)
    pickerWindow.setMenu(null);
    
    pickerWindow.loadFile('port-picker.html');
    
    pickerWindow.webContents.on('did-finish-load', () => {
      pickerWindow.webContents.send('port-list', portList);
    });
    
    let handled = false;

    ipcMain.once('port-selected', (event, portId) => {
      if (!handled) {
        handled = true;
        try {
          callback(portId || '');
        } catch (_) {}
      }
      // Close after invoking callback
      if (!pickerWindow.isDestroyed()) pickerWindow.close();
    });
    
    pickerWindow.on('closed', () => {
      ipcMain.removeAllListeners('port-selected');
      if (!handled) {
        handled = true;
        try {
          callback('');
        } catch (_) {}
      }
    });
  });
  
  session.defaultSession.on('serial-port-added', (event, port) => {
    console.log('serial-port-added FIRED WITH', port);
  });

  session.defaultSession.on('serial-port-removed', (event, port) => {
    console.log('serial-port-removed FIRED WITH', port);
  });

  session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial') {
      return true;
    }
    return false;
  });

  session.defaultSession.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial') {
      return true;
    }
    return false;
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
