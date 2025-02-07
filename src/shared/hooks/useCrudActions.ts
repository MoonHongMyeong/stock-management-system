import { AppError, DatabaseError, ValidationError } from "../types/Error";
import { toSnakeCaseArray } from "../utils/caseConverter";

interface CrudOptions<T> {
    tableName: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    validate?: (data: T) => boolean | string; 
}

export const useCrudActions = <T extends { id?: number }>({
    tableName,
    onSuccess,
    onError,
    validate,
}: CrudOptions<T>) => {

    const handleSave = async (data: Omit<T, 'id'>) => {
        try {
            if (validate) {
                const validationResult = validate(data as T);
                if (typeof validationResult === 'string') {
                    throw {
                        message: validationResult,
                        type: 'VALIDATION_ERROR'
                    } as ValidationError;
                }
            }

            const keys = Object.keys(data);
            const values = Object.values(data);
            const placeholders = keys.map(() => '?').join(', ');

            const result = await window.electron.db.query({
                query: `INSERT INTO ${tableName} (${(toSnakeCaseArray(keys)).join(', ')}) 
                        VALUES (${placeholders})`,
                params: values
            });

            if (!result.success) {
                throw {
                    message: result.error?.message ?? '알 수 없는 오류',
                    userMessage: result.error?.userMessage,
                    type: 'DATABASE_ERROR'
                } as DatabaseError;
            }

            onSuccess?.();
        } catch (error) {
            if ((error as AppError).type === 'DATABASE_ERROR') {
                const dbError = error as DatabaseError;
                onError?.(dbError.userMessage || dbError.message);
            } else if ((error as AppError).type === 'VALIDATION_ERROR') {
                const validationError = error as ValidationError;
                onError?.(validationError.message);
            } else {
                onError?.('알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    const handleUpdate = async (data: T) => {
        try {
            if(!data.id) {
                throw new Error('id가 없습니다.');
            }

            if (validate) {
                const validationResult = validate(data as T);
                if (typeof validationResult === 'string') {
                    throw new Error(validationResult);
                }
            }

            const { id, ...objectToUpdate } = data;
            const keys = Object.keys(objectToUpdate);
            const setClause = keys.map(key => `${key} = ?`).join(', ');
            
            const result = await window.electron.db.query({
                query: `UPDATE ${tableName} 
                        SET ${setClause} 
                        WHERE id = ?`,
                params: [...Object.values(objectToUpdate), id]
            });

            if (!result.success) {
                throw new Error(result.error?.message ?? '알 수 없는 오류');
            }

            onSuccess?.();
        } catch (error) {
            onError?.(error as string);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const result = await window.electron.db.query({
                query: `DELETE FROM ${tableName} 
                        WHERE id = ?`,
                params: [id]
            });

            if (!result.success) {
                throw new Error(result.error?.message ?? '알 수 없는 오류');
            }

            onSuccess?.();
        } catch (error) {
            onError?.(error as string);
        }
    };

    return { handleSave, handleUpdate, handleDelete };
}

