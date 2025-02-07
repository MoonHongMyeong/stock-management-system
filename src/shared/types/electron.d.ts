import { QueryRequest, TransactionRequest, QueryResult } from "./query";

interface IElectronAPI {
    db: {
        query: (params: QueryRequest) => Promise<QueryResult>;
        transaction: (params: TransactionRequest) => Promise<QueryResult>;
    }
}

declare global {
    interface Window {
        electron: IElectronAPI
    }
}

export {}; 