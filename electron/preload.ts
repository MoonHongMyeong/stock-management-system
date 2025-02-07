import { contextBridge, ipcRenderer } from 'electron';
import { QueryRequest, TransactionRequest } from './type/query';

contextBridge.exposeInMainWorld('electron', {
    db: {
        query: (params: QueryRequest) => ipcRenderer.invoke('db:query', params),
        transaction: (params: TransactionRequest) => ipcRenderer.invoke('db:transaction', params),
    }
});