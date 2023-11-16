import { IError } from "../libs/interfaces/answers/ierror";
import { ErrorCodes } from "../libs/interfaces/enums/error_codes";
import { AppError } from "../libs/classes/error";

/**
 * Устанавливает ошибку по умолчанию, если ни один из роутов не сработал
 * @param req 
 * @param res 
 * @param next 
 */
export function setDefaultError (req, res, next) {

    if (res.statusCode < ErrorCodes.BAD_REQUEST) {
        let code : number = ErrorCodes.NOT_FOUND;
        let error = new AppError(code);

        res.status(code);
        next(error);
    }
}

export function setError(err : AppError, req, res, next) {
    let message;
    let data;
    let error;

    switch (err.code) {
        //Ошибка выполнения запроса
        case ErrorCodes.BAD_REQUEST:
            message = err.message ? err.message : 'Bad Request';        
            break;
        //Нужно авторизоваться
        case ErrorCodes.UNAUTHORIZED:
            message = err.message ? err.message : 'Unauthorized';
            break;
        //Не хватает прав для доступа к эндпойнту
        case ErrorCodes.PERMISSION_DENIED:
            message = err.message ? err.message : 'Access denied';
            break;
        //Роут не найден 404
        case ErrorCodes.NOT_FOUND:
            message = err.message ? err.message : 'Rout not found';
            break;
        //Кастомная ошибка валидации
        default:
            message = err.message ? err.message : 'Unhandled error';
            break;
    }

    data = err.data ? err.data : {};
    error = new AppError(err.code, message, data);

    res.status(error.code);
    res.send(error);
    next(error);
}