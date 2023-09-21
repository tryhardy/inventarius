import winston from "winston";
import expressWinston from "express-winston";
import { createLogOptions } from '../../options/winston-mongodb-options';
import 'winston-mongodb';

const date = new Date();
const filename = date.getMonth() + '_' + date.getFullYear() + '.json';
const path = './logs/errors/' + filename;
const level = 'error';
const errorLogOption = createLogOptions('error');

export default expressWinston.errorLogger({
    transports: [
        new winston.transports.MongoDB(errorLogOption),
        new winston.transports.File({ 
            filename: path, 
            level: level,
        }),
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    msg: function(req, res) {
        return `Logging request error ${req.url} - ${res.statusCode} - ${req.method}.`;
    }
});