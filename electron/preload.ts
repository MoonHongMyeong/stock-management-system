import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    db: {
        insert: (params: any) => ipcRenderer.invoke('db:insert', params),
        select: (params: any) => ipcRenderer.invoke('db:select', params),
        update: (params: any) => ipcRenderer.invoke('db:update', params),
        delete: (params: any) => ipcRenderer.invoke('db:delete', params),
    }
});