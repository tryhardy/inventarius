import { Response, Request, NextFunction } from 'express'
import { JWT } from '../common/jwt';
import { AUTH_DATA_FIELD } from '../common/constants';
import { RequestAuthData } from '../interfaces/middleware/request_auth_data';

/**
 * Извлекает токен авторизации из Request
 * и записывает в req['auth_data'] для дальнейшего использования
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function extractToken(req : Request, res : Response, next : NextFunction) 
{
    //console.log(req.headersSent)
    let requestAuthData : RequestAuthData = JWT.getAuthDataFromHeaders(req);

    // Записываем данные в реквест, чтобы иметь к ним доступ внутри роутов
    req[AUTH_DATA_FIELD] = requestAuthData;
    
    next();
}