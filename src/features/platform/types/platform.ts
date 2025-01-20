export interface Platform {
    id?: number;
    name: string;
    apiUrl: string;
    apiKey: string;
    path: string;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
} 