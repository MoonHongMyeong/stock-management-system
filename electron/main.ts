import { app, BrowserWindow } from 'electron'
import { initializeDatabase } from './core/database'
import { createWindow } from './core/window'

const isDevelopment = !app.isPackaged

app.whenReady()
.then(() => {
    initializeDatabase(isDevelopment)
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