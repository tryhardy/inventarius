import { IError } from "../../interfaces/common/result/ierror";
import { IEnumStatuses } from "../../enums/enum_statuses";

/**
 * Результат выполнения запроса, который мы возвращаем на фронтенд
 * если в процессе произошла какая-либо ошибка
 */
export class AppError extends Error implements IError {
    code: number;
    status: IEnumStatuses.ERROR;
    date: string;
    message: string;
    data: {};

    constructor(statusCode: number, message: string = '', data = {})
    {
        super();
        this.status = IEnumStatuses.ERROR;
        this.code = statusCode;
        this.date = (new Date()).toString();
        this.data = data ? data : {};
        this.message = message ? message : '';
    }
}