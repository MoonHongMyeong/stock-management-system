import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export const db = new Database('stock.db', {
    timeout: 5000,
    verbose: console.log
});

export const initializeDatabase = (isDevelopment: boolean) => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, '..', 'resources', 'schema.sql'), 'utf8');
        
        if (isDevelopment) {
            const dropSchema = fs.readFileSync(path.join(__dirname, '..', 'resources', 'drop_table.sql'), 'utf8');
            db.prepare('BEGIN').run();
            try {
                db.exec(dropSchema);
                console.log("Drop schema executed successfully");
                db.prepare('COMMIT').run();
            } catch (error) {
                db.prepare('ROLLBACK').run();
                console.error("Error during drop schema:", error);
                throw error;
            }
        }

        db.prepare('BEGIN').run();
        try {
            db.exec(schema);
            console.log("Schema executed successfully");
            db.prepare('COMMIT').run();
        } catch (error: any) {
            db.prepare('ROLLBACK').run();
            console.error("Error during schema creation:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw error;
        }

        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};
