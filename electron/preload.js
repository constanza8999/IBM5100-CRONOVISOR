const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Open documentation folder
  openDocs: () => ipcRenderer.invoke('open-docs'),

  // Launch MAME
  launchMAME: (system) => ipcRenderer.invoke('launch-mame', system),

  // Get app version
  getVersion: () => ipcRenderer.invoke('get-version')
});
