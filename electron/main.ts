import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import './ipc/database'

const Database = require('better-sqlite3');
const db = new Database('stock.db', {
    timeout: 5000,
    verbose: console.log
});

const isDevelopment = !app.isPackaged;

// db 초기화
const initializeDatabase = () => {
    const schema = fs.readFileSync(path.join(__dirname, 'resources/', 'schema.sql'), 'utf8');
    
    if (isDevelopment) {
        const dropSchema = fs.readFileSync(path.join(__dirname, 'resources/', 'drop_table.sql'), 'utf8');
        db.transaction(() => {
            db.exec(dropSchema);
        });
    }

    db.transaction(() => {
        db.exec(schema);
    });

    console.log('database initialized');
}

// 윈도우 창
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 개발 모드에서는 로컬 서버 사용
  if (isDevelopment) {
    win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady()
.then(() => {
    initializeDatabase();
    createWindow();
})

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