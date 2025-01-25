import { PlatformService } from '@/features/platform/service/platformService';
import { Platform } from '@/features/platform/types/platform';
import { create } from 'zustand';

interface PlatformStore {
    activeMenus: Platform[];
    platforms: Platform[];
    refreshMenus: () => Promise<void>;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
    activeMenus: [],
    platforms: [],
    refreshMenus: async () => {
        try {
            const menus = await PlatformService.getActiveMenus();
            set({ activeMenus: menus });
            set({ platforms: menus });
        } catch (error) {
            console.error('Refresh Menus Error:', error);
        }
    }
})); 