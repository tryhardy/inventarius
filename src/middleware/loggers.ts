import expressWinston from "express-winston";
import winston, { Logger } from "winston";
import 'winston-mongodb';
import { defaultLogOption, createLogOptions } from '../options/winston-mongodb-options'

const date = new Date();
//date.getMonth() function is zero indexed based
const filename = (date.getMonth() + 1) + '_' + date.getFullYear() + '.json';
const errorLogOption = createLogOptions('error');

/**
 * Для логирования всех запросов к API перед роутами
 */
export const routLogger = expressWinston.logger({
    transports: [
        new winston.transports.MongoDB(defaultLogOption),
        new winston.transports.File({ 
            filename: './logs/requests/' + filename, 
            level: 'info',
        }),
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    msg: function(req, res) {
        return `Logging request ${req.url} - ${res.statusCode} - ${req.method}.`;
    }
});

/**
 * Для логирования ошибок обращений к API после всех роутов
 */
export const errorRoutLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.MongoDB(errorLogOption),
        new winston.transports.File({ 
            filename: './logs/errors/' + filename, 
            level: 'error',
        }),
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    msg: function(req, res) {
        return `Logging request error ${req.url} - ${res.statusCode} - ${req.method}.`;
    }
});

/**
 * Кастомный лог
 * data - передаем сюда какие-нибудь специфические данные, которые хотим видеть в логах
 * req - объект Request передаем, если нужно записывать в логи
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