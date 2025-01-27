import { LogisticsSettingTypes } from "@/features/logistics/types/logistics";

export const convertLogisticsType = (type: LogisticsSettingTypes): string => {
  const typeMap: Record<LogisticsSettingTypes, string> = {
    [LogisticsSettingTypes.POINT]: '물류 단계',
    [LogisticsSettingTypes.STATUS]: '상태'
  };
  return typeMap[type];
};

export const getLogisticsTypeOptions = () => {
  return Object.entries(LogisticsSettingTypes).map(([key, value]) => ({
    key,
    value,
    label: convertLogisticsType(value)
  }));
}; 