import expressWinston from "express-winston";
import winston, { Logger } from "winston";
import 'winston-mongodb';
import { Request, NextFunction, Response } from "express";
import { ILogOption } from "../interfaces/middleware/ilog_option";
import { url as mongoUrl, dbName } from "../config/mongo";
import path from 'path';

const pathJS = path;
const date = new Date();
//date.getMonth() function is zero indexed based
const filename = (date.getMonth() + 1) + '_' + date.getFullYear() + '.json';

export class LoggerMiddleware
{
    static baseLogLevel = 'info';
    static errorLogLevel = 'error';
    
    static path = pathJS.join(pathJS.resolve(__dirname, '../../'), '/logs/');

    /**
     * Дефолтные настройки для логов
     */
    static defaultlogOption: ILogOption = {
        db: mongoUrl,
        dbName: dbName,
        collection: 'logs',
        level: 'info',
        storeHost: true,
        decolorize: true,
        metaKey: 'meta'
    }

    /**
     * Создает кастомные настройки для логов
     * @param collection 
     * @param dbLogName 
     * @returns 
     */
    static createLogOptions(collection : string = 'logs', dbLogName : string = dbName) : ILogOption
    {
        let option = this.defaultlogOption;
        option.collection = collection;
        option.dbName = dbLogName;
        return option;
    }

    /**
     * Кастомный лог (возвращает logger - экземпляр класса Logger). 
     * Чтобы сохранить лог: logger.log{level: 'info', message: 'This is super secret - hide it.'})
     * @param data - передаем сюда какие-нибудь специфические данные, которые хотим видеть в логах
     * @param req - объект Request передаем, если нужно записывать в логи
     * @param path - путь к папке с логами
     * @param collection - название таблицы в БД, по умолчанию logs
     * @returns Logger
     */
    static getLog(data: any = null, req : Request = null, path : string = './', collection ?: string) : Logger 
    {
        let logOptions = LoggerMiddleware.defaultlogOption;
        if (collection) {
            logOptions.collection = collection
        }
    
        var result = {
            data: data
        };
    
        if (req) {   
            result['request'] = req;
        }
    
        var customPath = pathJS.resolve(this.path, path);
        var filePath = pathJS.join(customPath, filename);

        return winston.createLogger({
            format: winston.format.json(),
            transports: [
                new winston.transports.MongoDB(logOptions),
                new winston.transports.File({ 
                    filename: filePath
                }),
            ],
            defaultMeta: {
                'meta': result
            },
        });
    }

    /**
     * Для логирования всех запросов к API перед роутами
     */
    static async getRoutLogger(req: Request, res: Response, next: NextFunction)
    {
        LoggerMiddleware.getLog({}, req, 'requests').log({
            level: LoggerMiddleware.baseLogLevel,
            message: `Logging all incoming requests ${req.url} - ${res.statusCode} - ${req.method}.`
        });
        
        next();
    }
}