import { ipcMain } from "electron";
import { db } from "../core/database";
import { QueryRequest, TransactionRequest, QueryResult, SqliteError } from "../type/query";

ipcMain.handle('db:query', async (_event, request: QueryRequest): Promise<QueryResult> => {
    try {
        const stmt = db.prepare(request.query);

        if(request.query.trim().startsWith('SELECT')) {
            return {
                success: true,
                data: stmt.all(request.params)
            };
        }

        const result = stmt.run(request.params);

        return {
            success: true,
            changes: result.changes,
            lastInsertRowId: Number(result.lastInsertRowid)
        };
    } catch (e) {
        const error = e as SqliteError;
        console.error('db:query error', error);

        let userMessage: string | undefined;

        if (error.message.includes('UNIQUE constraint failed')) {
            userMessage = '이미 존재하는 데이터입니다.';
        } else if (error.message.includes('NOT NULL constraint failed')) {
            userMessage = '필수 입력 항목이 누락되었습니다.';
        } else if (error.message.includes('FOREIGN KEY constraint failed')) {
            userMessage = '참조하는 데이터가 존재하지 않습니다.';
        }else if (error.message.includes('SQLITE_BUSY')) {
            userMessage = '다른 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.';
        }

        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                userMessage: userMessage
            }
        }
    } 
});

ipcMain.handle('db:transaction', async (_event, { queries }) => {
    try {
        const transaction = db.transaction((queries) => {
            for (const { query, params } of queries) {
                db.prepare(query).run(params);
            }
        });

        transaction(queries);
        return { success: true };
        
    } catch (e) {
        const error = e as SqliteError;
        console.error('Transaction error:', error);
        return {
            success: false,
            error: {
                message: error.message,
                userMessage: '작업 처리 중 오류가 발생했습니다.'
            }
        };
    }
});

