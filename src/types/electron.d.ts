interface IElectronAPI {
    db: {
        insert: (params: any) => Promise<any>;
        select: (params: any) => Promise<any>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<any>;
        transaction: (params: any) => Promise<any>;
    }
}

declare global {
    interface Window {
        electron: IElectronAPI
    }
}

export {}; 