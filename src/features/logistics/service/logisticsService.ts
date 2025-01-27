import { Logistics, LogisticsViewModel } from "@/features/logistics/types/logistics";

export const LogisticsService = {
    async getAll() : Promise<LogisticsViewModel[]> {
        try {
            // POINT 타입 조회
            const points = await window.electron.db.select({
                table: 'logistics_definitions',
                columns: ['id', 'platform_id', 'code', 'name', 'type', 'point_id', 'description', 'sort_order', 'is_active'],
                where: [[`type = 'POINT'`]],
                orderBy: 'sort_order ASC, name ASC'
            });

            // STATUS 타입 조회
            const statuses = await window.electron.db.select({
                table: 'logistics_definitions',
                columns: ['id', 'platform_id', 'code', 'name', 'type', 'point_id', 'description', 'sort_order', 'is_active'],
                where: [[`type = 'STATUS'`]],
                orderBy: 'sort_order ASC, name ASC'
            });

            // 데이터 구조화
            const result = points.map((point: Logistics) => ({
                ...point,
                statuses: statuses.filter((status: Logistics) => status.point_id === point.id)
            }));

            return result;
        } catch (error) {
            console.error('Logistics Get All Error:', error);
            throw error;
        }
    },

    async create(data: Omit<Logistics, 'id'>) : Promise<void> {
        try {
            await window.electron.db.insert({
                table: 'logistics_definitions',
                data: {
                    platform_id: data.platform_id,
                    code: data.code,
                    name: data.name,
                    type: data.type,
                    point_id: data.point_id,
                    description: data.description,
                    sort_order: data.sort_order,
                    is_active: data.is_active ? 1 : 0
                }
            });
        } catch (error) {
            console.error('Logistics Create Error:', error);
            throw error;
        }
    },

    async toggleActive(id: number, isActive: boolean) : Promise<void> {
        await window.electron.db.update({
            table: 'logistics_definitions',
            data: { is_active: isActive ? 1 : 0 },
            where: [[`id = ${id}`]]
        });
    },

    async update(id: number, data: Omit<Logistics, 'id'>) : Promise<void> {
        console.log('update', id, data);
        await window.electron.db.update({
            table: 'logistics_definitions',
            data: {
                platform_id: data.platform_id,
                code: data.code,
                name: data.name,
                type: data.type,
                description: data.description,
                sort_order: data.sort_order,
                is_active: data.is_active ? 1 : 0
            },
            where: [[`id = ${id}`]]
        });
    },

    async delete(id: number) : Promise<void> {
        await window.electron.db.delete({
            table: 'logistics_definitions',
            where: [[`id = ${id}`]]
        });
    }
}