import { IEnumErrorCodes as ErrorCodes } from "../enums/error_codes";
import { AppError } from "../common/result/error";
import { Middleware } from '@decorators/express';
import { Response, NextFunction, Request } from "express";
import { LoggerMiddleware } from "./loggers";

/**
 * Обработка ошибок
 * Устанавливает ошибку по умолчанию (404), если ни один из роутов не сработал
 */
export class DefaultMiddleware implements Middleware
{
    /**
     * Устанавливает ошибку по умолчанию (404), если ни один из роутов не сработал
     * @param req 
     * @param res 
     * @param next 
     */
    public use(req: Request, res: Response, next: NextFunction): void {
        try {
            if (res.statusCode < ErrorCodes.BAD_REQUEST) {
                let code : number = ErrorCodes.NOT_FOUND;
                throw new AppError(code);
            }
        }
        catch (error) {
            console.log('ERROR MIDDLEWARE WORKED - ROUT NOT FOUND -  SET DEFAULT 404 ERROR')
            next(error);
        }
    }

    /**
     * Устанавливает ошибку и дефолтное сообщение к ней в зависимости от кода ошибки
     * Приводит все ошибки к единообразному виду, создавая экземпляр класса AppError
     * @param err 
     * @param req 
     * @param res 
     * @param next 
     */
    static setError (err: any, req: Request, res: Response, next: Function) {

        let message;
        let data;
        let error;

        if (err instanceof AppError) {
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
        }
        else {
            error = DefaultMiddleware.formatError(err);
        }
    
        res.status(error.code);
        res.send(error);

        //Логируем ошибку в файл и в Монго БД
        LoggerMiddleware.getLog(error, req, 'errors').log({
            level: LoggerMiddleware.errorLogLevel,
            message: `Logging request error ${req.url} - ${res.statusCode} - ${req.method}.`
        });

        next(error);
    }
    
    /**
     * Преобразует любую входящую ошибку в экземпляр класса AppError для того, чтобы
     * унифицировать вывод сообщения об ошибке
     * @param error 
     * @param status 
     * @returns 
     */
    protected static formatError(error, status = null)  : AppError
    {
        let result;
        let errors = error.errors;
    
        //Ошибка выглядит так если она возникла в процессе обращения к БД
        if (errors && errors.length > 0) {
            
            let messages = {
                errors: {}
            };
    
            errors.forEach((item, i) => {
                if (messages.errors[item.path]) {
                    messages.errors[item.path].push(item.message);
                }
                else {
                    messages.errors[item.path] = [
                        item.message
                    ];
                }
            }) 
    
            result = messages;
        }
        else {
            result = {
                error: error.message
            };
        }
    
        if (!status) status = ErrorCodes.BAD_REQUEST;
    
        return new AppError(status, '', result);
    }
}