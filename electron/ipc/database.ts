import { ipcMain } from "electron";
import { db } from "../core/database";

ipcMain.handle('db:insert', async ( _event, { table, data }) => {
    try {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const query = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${values.map(() => '?').join(',')})`;
        const stmt = db.prepare(query);
        stmt.run(...values);
        return { success: true, message: 'Data inserted successfully' };
    } catch (e) {
        console.error('db:insert Error', e);
        throw e;
    }
});

ipcMain.handle('db:select', async ( _event, { table, columns, where }) => {
    try {
        const query = `SELECT ${columns.join(',')} FROM ${table} ${where ? `WHERE ${where}` : ''}`;
        const stmt = db.prepare(query);
        return stmt.all();
    } catch (e) {
        console.error('db:select Error', e);
        throw e;
    }
}); 

ipcMain.handle('db:update', async ( _event, { table, data, where }) => {
    try {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const query = `UPDATE ${table} SET ${fields.map((field, index) => `${field} = ?`).join(',')} ${where ? `WHERE ${where}` : ''}`;
        const stmt = db.prepare(query);
        stmt.run(...values);
        return { success: true, message: 'Data updated successfully' };
    } catch (e) {
        console.error('db:update Error', e);
        throw e;
    }
});

ipcMain.handle('db:delete', async ( _event, { table, where }) => {
    try {
        const query = `DELETE FROM ${table} ${where ? `WHERE ${where}` : ''}`;
        const stmt = db.prepare(query);
        stmt.run();
        return { success: true, message: 'Data deleted successfully' };

    } catch (e) {
        console.error('db:delete Error', e);
        throw e;
    }
});
