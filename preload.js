const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload script loading...");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("vibesApp", {
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),
  loadMusicLibrary: () => ipcRenderer.invoke('load-music-library')
});

console.log("vibesApp exposed to main world");
