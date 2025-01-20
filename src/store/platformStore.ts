import { PlatformService } from '@/platform/service/platformService';
import { Platform } from '@/platform/types/platform';
import { create } from 'zustand';

interface PlatformStore {
    activeMenus: Platform[];
    refreshMenus: () => Promise<void>;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
    activeMenus: [],
    refreshMenus: async () => {
        try {
            const menus = await PlatformService.getActiveMenus();
            set({ activeMenus: menus });
        } catch (error) {
            console.error('Refresh Menus Error:', error);
        }
    }
})); 