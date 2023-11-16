import { ISuccess } from "../interfaces/answers/isuccess";

export class AppSuccess implements ISuccess 
{
    status: 'SUCCESS';
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