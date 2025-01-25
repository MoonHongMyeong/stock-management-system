import { Platform } from '@/features/platform/types/platform';

export const PlatformService = {
    async getAll(): Promise<Platform[]> {
        try {
            const result = await window.electron.db.select({
                table: 'platforms',
                columns: [
                    'id',
                    'name',
                    'api_url as apiUrl',
                    'api_key as apiKey',
                    'sort_order as sortOrder',
                    'is_active as isActive',
                    'path'
                ],
                orderBy: 'sort_order ASC, name ASC'
            });
            return result;
        } catch (error) {
            console.error('Platform Get Error:', error);
            throw error;
        }
    },

    async create(platform: Omit<Platform, 'id'>): Promise<number> {
        try {
            const result = await window.electron.db.insert({
                table: 'platforms',
                data: {
                    name: platform.name,
                    api_url: platform.apiUrl,
                    api_key: platform.apiKey,
                    sort_order: platform.sortOrder,
                    is_active: platform.isActive ? 1 : 0,
                    path: '/platform/temp'
                }
            });
            
            const id = result.lastInsertRowid;
            
            await window.electron.db.update({
                table: 'platforms',
                data: { path: `/platform/${id}` },
                where: `id = ${id}`
            });
            
            return id;
        } catch (error) {
            console.error('Platform Create Error:', error);
            throw error;
        }
    },

    async update(id: number, platform: Partial<Platform>): Promise<void> {
        try {
            const data: any = {};
            if (platform.name) data.name = platform.name;
            if (platform.apiUrl) data.api_url = platform.apiUrl;
            if (platform.apiKey) data.api_key = platform.apiKey;
            if (platform.sortOrder !== undefined) data.sort_order = platform.sortOrder;
            if (platform.isActive !== undefined) data.is_active = platform.isActive ? 1 : 0;

            await window.electron.db.update({
                table: 'platforms',
                data,
                where: `id = ${id}`
            });
        } catch (error) {
            console.error('Platform Update Error:', error);
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
            await window.electron.db.delete({
                table: 'platforms',
                where: `id = ${id}`
            });
        } catch (error) {
            console.error('Platform Delete Error:', error);
            throw error;
        }
    },

    async toggleActive(id: number, isActive: boolean): Promise<void> {
        try {
            await window.electron.db.update({
                table: 'platforms',
                data: { is_active: isActive ? 1 : 0 },
                where: `id = ${id}`
            });
        } catch (error) {
            console.error('Platform Toggle Error:', error);
            throw error;
        }
    },

    async getActiveMenus(): Promise<Platform[]> {
        try {
            const result = await window.electron.db.select({
                table: 'platforms',
                columns: [
                    'id',
                    'name',
                    'path',
                    'icon',
                    'sort_order as sortOrder'
                ],
                where: 'is_active = 1',
                orderBy: 'sort_order ASC, name ASC'
            });
            return result;
        } catch (error) {
            console.error('Platform Get Active Menus Error:', error);
            throw error;
        }
    }
}; 