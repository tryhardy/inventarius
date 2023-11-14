import { IError } from "../interfaces/answers/ierror";

export class AppError implements IError {
    code: number;
    status: string;
    date: string;
    message: string;
    data: {};

    constructor(statusCode: number, message: string = '', data = {})
    {
        this.status = 'ERROR';
        this.code = statusCode;
        this.date = (new Date()).toString();
        this.data = data ? data : {};
        this.message = message ? message : '';
    }
}