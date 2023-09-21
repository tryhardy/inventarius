import winston from "winston";
import expressWinston from "express-winston";
import 'winston-mongodb';
import { defaultLogOption } from '../../options/winston-mongodb-options'

const date = new Date();
const filename = date.getMonth() + '_' + date.getFullYear() + '.json';

export default expressWinston.logger({
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