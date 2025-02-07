import { app, BrowserWindow } from 'electron'
import { initializeDatabase } from './core/database'
import { createWindow } from './core/window'
import './ipc/database'

const isDevelopment = !app.isPackaged

app.whenReady()
.then(() => {
    initializeDatabase()
    createWindow(isDevelopment)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(isDevelopment)
  }
}) 