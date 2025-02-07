import { BrowserWindow, webContents } from "electron"
import * as path from "path"

export const createWindow = (isDevelopment: boolean) => {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'preload.js')
      }
    })
  
    // 개발 모드에서는 로컬 서버 사용
    if (isDevelopment) {
      win.loadURL('http://localhost:5173/');
      win.webContents.openDevTools();

      win.webContents.on(`before-input-event`, (event, input) => {
        if (input.key === 'F12') {
          event.preventDefault();
          win.webContents.toggleDevTools();
        }
      });

    } else {
      // 프로덕션 모드에서는 빌드된 파일 로드
      win.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    
  }