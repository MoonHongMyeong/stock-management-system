interface Menu {
    id: number;
    name: string;
    route: string;
    isActive: boolean;
}

interface MenuResponse {
    id: number;
    name: string;
    route: string;
    is_active: boolean;
}

export type { Menu, MenuResponse };