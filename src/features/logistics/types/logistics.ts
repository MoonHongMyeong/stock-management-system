export enum LogisticsSettingTypes {
    POINT = "POINT",
    STATUS = "STATUS"
}

export interface LogisticsSettingFormData {
    platform: number | undefined;
    code: string;
    name: string;
    type: LogisticsSettingTypes;
    point: number | undefined;
    description: string;
    sortOrder: number;
}

export interface Logistics {
    id: number;
    platform_id: number;
    code: string;
    name: string;
    type: LogisticsSettingTypes;
    point_id: number | undefined;
    description: string;
    sort_order: number;
    is_active: boolean;
}

export interface LogisticsViewModel extends Logistics {
    statuses: LogisticsViewModel[];
}
