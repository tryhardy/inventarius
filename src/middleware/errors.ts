import { IError } from "../interfaces/ierror";
import { ErrorCodes } from "../enums/error-codes";

/**
 * Устанавливает ошибку по умолчанию, если ни один из маршрутов не был применен
 * @param req 
 * @param res 
 * @param next 
 */
export function setDefaultError (req, res, next) {
    if (res.statusCode < ErrorCodes.BAD_REQUEST) {
        let code : number = ErrorCodes.NOT_FOUND;

        res.status(code);
        next(code);
    }
}

/**
 * Запрос некорректно сформирован (ошибка валидации запроса)
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error400 (err, req, res, next) {

    if (err == ErrorCodes.BAD_REQUEST) {
        let code : number = ErrorCodes.BAD_REQUEST;
        let errorMessage : IError = {
            status: 'ERROR',
            code: code,
            message: 'Bad Request'
        }
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }
    else {
        next(err);    
    }
}

/**
 * Пользователь неавторизован
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error401 (err, req, res, next) {

    if (err == ErrorCodes.UNAUTHORIZED) {
        let code : number = ErrorCodes.UNAUTHORIZED;
        let errorMessage : IError = {
            status: 'ERROR',
            code: code,
            message: 'Unauthorized'
        }
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }
    else {
        next(err);    
    }
}

/**
 * В доступе на страницу отказано
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error403 (err, req, res, next) {

    if (err == ErrorCodes.PERMISSION_DENIED) {
        let code : number = ErrorCodes.PERMISSION_DENIED;
        let errorMessage : IError = {
            status: 'ERROR',
            code: code,
            message: 'Access denied'
        }
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }
    else {
        next(err);    
    }
}

/**
 * Маршрут не найден
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error404 (err, req, res, next) {

    if (err == ErrorCodes.NOT_FOUND) {
        let code : number = ErrorCodes.NOT_FOUND;
        let errorMessage : IError = {
            status: 'ERROR',
            code: code,
            message: 'Rout not found'
        }
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }

    next(err);
}