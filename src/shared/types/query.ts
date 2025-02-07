interface QueryRequest {
    query: string;
    params: any[];
}

interface TransactionRequest {
    queries: QueryRequest[];
}

interface QueryResult {
    success: boolean;
    data?: any;
    error?: SqliteError;
    changes?: number;
    lastInsertRowId?: number;
}

interface SqliteError {
    code: string;
    message: string;
    userMessage?: string;
}

export type { QueryRequest, TransactionRequest, QueryResult, SqliteError };