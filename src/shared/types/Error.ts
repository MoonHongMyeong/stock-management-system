export interface DatabaseError {
  message: string;
  userMessage?: string;
  code?: string;
  type: 'DATABASE_ERROR';
}

export interface ValidationError {
  message: string;
  type: 'VALIDATION_ERROR';
}

export type AppError = DatabaseError | ValidationError; 