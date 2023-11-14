
import { ILogOption } from "../libs/interfaces/logs/ilogoption";
import { url, dbName } from "./mongo";

/**
 * Используем, если нужно кастомизировать логи. 
 * Например изменить уровень логов, или сохранять их в отдельной таблице БД
 * 
 * @param level 
 * @param collection 
 * @param db 
 * @param databaseName 
 * @returns 
 */
export function createLogOptions(
    collection : string = 'logs', 
    db : string = url,
    databaseName : string = dbName,
) : ILogOption
{
    return {
        db: db,
        dbName: databaseName,
        collection: collection,
        level: 'info',
        storeHost: true,
        decolorize: true,
        metaKey: 'meta'
    }
}

// Дефолтные настройки для логов
export const defaultLogOption : ILogOption = {
    db: url,
    dbName: dbName,
    collection: 'logs',
    level: 'info',
    storeHost: true,
    decolorize: true,
    metaKey: 'meta'
}