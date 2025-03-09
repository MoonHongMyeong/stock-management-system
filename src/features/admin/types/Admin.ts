interface Menu {
    id: number;
    name: string;
    route: string;
    isActive: number;
    displayOrder: number;
}

interface MenuResponse {
    id: number;
    name: string;
    route: string;
    is_active: number;
    display_order: number;
}

interface MenuForm {
    id?: number;
    name: string;
    route: string;
    isActive: number;
    displayOrder: number;
}

export type { Menu, MenuResponse, MenuForm };