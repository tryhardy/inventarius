import { ISuccess } from "../../interfaces/common/result/isuccess";
import { IEnumStatuses } from "../../enums/enum_statuses";

/**
 * Результат выполнения запроса, который мы возвращаем на фронтенд
 * если запрос успешно выполнился
 */
export class AppSuccess implements ISuccess 
{
    status: IEnumStatuses.SUCCESS;
    code: number;
    date: string;
    message: string;
    data: {};

    constructor(data = {}, message: string = '', statusCode: number = 200)
    {
        this.code = statusCode;
        this.date = (new Date()).toString();
        this.data = data ? data : {};
        this.message = message ? message : '';
    }
}