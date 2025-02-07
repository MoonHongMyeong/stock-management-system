/**
 * 스네이크 케이스를 카멜 케이스로 변환
 * @param obj 변환할 객체
 * @returns 변환된 객체
 */
export const toCamelCase = <T extends object>(obj: Record<string, any>): T => {
    const camelCaseObj: Record<string, any> = {};

    Object.keys(obj).forEach(key => {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseObj[camelCaseKey] = obj[key];
    });

    return camelCaseObj as T;
};

/**
 * 카멜 케이스를 스네이크 케이스로 변환
 * @param obj 변환할 객체
 * @returns 변환된 객체
 */
export const toSnakeCase = <T extends object>(obj: Record<string, any>): T => {
    const snakeCaseObj: Record<string, any> = {};

    Object.keys(obj).forEach(key => {
        const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        snakeCaseObj[snakeCaseKey] = obj[key];
    });

    return snakeCaseObj as T;
};

