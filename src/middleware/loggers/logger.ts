import winston, { Logger } from "winston";
import 'winston-mongodb';
import { createLogOptions } from '../../options/winston-mongodb-options'

/**
 * data - передаем сюда какие-нибудь специфические данные
 * req - объект Request
 * path - путь к папке с логами
 * level - уровень логов, по умолчанию info
 * collection - название таблицы в БД, по умолчанию logs
 */
export default (
    data: any = {}, 
    req : any = {}, 
    path : string = './logs/',
    collection ?: string
    ) : Logger => {

    const logOptions = createLogOptions(collection);

    var result = {
        data: data
    };

    if (req) {
        var requestData = {
            url: req.url || '',
            params: req.params || '',
            query: req.query || '',
            ip: req.socket.remoteAddress || '',
        };

        result['request'] = requestData;
    }

    var date = new Date();
    var filename = date.getMonth() + '_' + date.getFullYear() + '.json';
    var filePath = path + filename;

    const logger = winston.createLogger({
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

    return logger;
}