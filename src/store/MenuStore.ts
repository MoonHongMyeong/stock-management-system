import { create } from 'zustand';
import { deleteMenu, fetchMenus, saveMenu, updateMenu } from '@/features/admin/services/AdminService';
import { Menu } from '@/features/admin/types/Admin';

interface MenuStore {
  /**
   * 메뉴 목록
   */
  menus: Menu[];
  /**
   * 메뉴 조회
   * @param isActive 메뉴 활성화 여부
   */ 
  fetchMenus: (isActive: boolean) => Promise<void>;
  /**
   * 메뉴 등록
   * @param menu 등록할 메뉴
   */
  saveMenu: (menu: Omit<Menu, 'id'>) => Promise<void>;
  /**
   * 메뉴 수정
   * @param menu 수정할 메뉴
   */
  updateMenu: (menu: Menu) => Promise<void>;

  /**
   * 메뉴 삭제
   * @param id 삭제할 메뉴의 id
   */
  deleteMenu: (id: number) => Promise<void>;
}

export const menuStore = create<MenuStore>((set) => ({
  menus: [],
  fetchMenus: async (isActive: boolean) => {
    const menus = await fetchMenus(isActive);
    set({ menus });
  },
  saveMenu: async (menu: Omit<Menu, 'id'>) => {
    const id = await saveMenu(menu);
    if(id){
      set((state) => ({
        menus: [...state.menus, { ...menu, id }],
      }));
    }
  },
  updateMenu: async (menu: Menu) => {
    const id = await updateMenu(menu);
    if(id){
      set((state) => ({
        menus: state.menus.map((m) => m.id === menu.id ? menu : m),
      }));
    }
  },
  deleteMenu: async (id: number) => {
    const result = await deleteMenu(id);
    if(result){
      set((state) => ({
        menus: state.menus.filter((m) => m.id !== id),
      }));
    }
  },
}));
