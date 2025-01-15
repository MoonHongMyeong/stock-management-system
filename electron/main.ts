import { app, BrowserWindow } from 'electron'
import * as path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 개발 모드에서는 로컬 서버 사용
  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
}) 