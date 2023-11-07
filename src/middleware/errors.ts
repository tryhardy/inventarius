import { IError } from "../interfaces/ierror";
import { ErrorCodes } from "../enums/error-codes";

export function getError(code, message = '', data = {}) : IError
{
    return {
        status: 'ERROR',
        code : code,
        data : data,
        message: message,
        date: (new Date).toString()
    }
}

/**
 * Устанавливает ошибку по умолчанию, если ни один из роутов не сработал
 * @param req 
 * @param res 
 * @param next 
 */
export function setDefaultError (req, res, next) {
    if (res.statusCode < ErrorCodes.BAD_REQUEST) {
        let code : number = ErrorCodes.NOT_FOUND;

        let errorMessage : IError = getError(code);

        res.status(code);
        next(errorMessage);
    }
}

/**
 *Тип ошибки: Запрос некорректно сформирован (ошибка валидации запроса)
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error400 (err, req, res, next) {

    if (err.code == ErrorCodes.BAD_REQUEST) {
        let code : number = ErrorCodes.BAD_REQUEST;

        let errorMessage : IError = getError(
            code,
            err.message ? err.message : 'Bad Request',
            err.data ? err.data : {}
        );

        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }
    else {
        next(err);    
    }
}

/**
 * Тип ошибки: Пользователь неавторизован
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error401 (err, req, res, next) {

    if (err.code == ErrorCodes.UNAUTHORIZED) {
        let code : number = ErrorCodes.UNAUTHORIZED;

        let errorMessage : IError = getError(
            code,
            err.message ? err.message : 'Unauthorized',
            err.data ? err.data : {}
        );
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }
    else {
        next(err);    
    }
}

/**
 * Тип ошибки: В доступе отказано
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error403 (err, req, res, next) {

    if (err == ErrorCodes.PERMISSION_DENIED) {
        let code : number = ErrorCodes.PERMISSION_DENIED;

        let errorMessage : IError = getError(
            code,
            err.message ? err.message : 'Access denied',
            err.data ? err.data : {}
        );
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }
    else {
        next(err);    
    }
}

/**
 * Тип ошибки: Маршрут не найден
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function error404 (err, req, res, next) {

    if (err.code == ErrorCodes.NOT_FOUND) {
        let code : number = ErrorCodes.NOT_FOUND;

        let errorMessage : IError = getError(
            code,
            err.message ? err.message : 'Rout not found',
            err.data ? err.data : {}
        );
    
        res.status(code);
        res.send(errorMessage);
        next(errorMessage);
    }

    next(err);
}