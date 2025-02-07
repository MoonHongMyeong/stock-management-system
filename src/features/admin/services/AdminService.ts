import { Menu, MenuResponse } from '@/features/admin/types/Admin';
import { toCamelCase } from '@/shared/utils/caseConverter';

/**
 * 메뉴 조회 서비스
 * @param isActive 메뉴 활성화 여부
 * @returns 메뉴 목록
 */
export const fetchMenus = async (isActive: boolean): Promise<Menu[]> => {
    const result = await window.electron.db.query({
        query: `SELECT 
                    id, 
                    name, 
                    route, 
                    is_active 
                FROM menus 
                WHERE is_active = ?`,
        params: [isActive]
    });
    return result.success 
        ? result.data.map((menu: MenuResponse) => toCamelCase<Menu>(menu))
        : [];
};

/**
 * 메뉴 등록 서비스
 * @param menu 등록할 메뉴
 * @returns 등록된 메뉴의 id (실패 시 0)
 */
export const saveMenu = async (menu: Omit<Menu, 'id'>) => {
    const result = await window.electron.db.query({
        query: `INSERT INTO menus (name, route, is_active) 
                VALUES (?, ?, ?)`,
        params: [menu.name, menu.route, menu.isActive]
    });
    return result.success 
        ? result.lastInsertRowId 
        : 0;
};

/**
 * 메뉴 수정 서비스
 * @param menu 수정할 메뉴
 * @returns 수정된 메뉴의 id (실패 시 0)
 */
export const updateMenu = async (menu: Menu) => {
    const result = await window.electron.db.query({
        query: `UPDATE menus 
                SET name = ?, route = ?, is_active = ? 
                WHERE id = ?`,
        params: [menu.name, menu.route, menu.isActive, menu.id]
    });

    return result.success 
        ? result.changes 
        : 0;
};

/**
 * 메뉴 삭제 서비스
 * @param id 삭제할 메뉴의 id
 * @returns 삭제된 메뉴의 id (실패 시 0)
 */
export const deleteMenu = async (id: number) => {
    const result = await window.electron.db.query({
        query: `DELETE FROM menus 
                WHERE id = ?`,
        params: [id]
    });

    return result.success 
        ? result.changes 
        : 0;
};