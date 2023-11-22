import { IID } from "../../models/iid";

// Такие данные по пользователю нужны, чтобы сгенерировать JWT token, 
// и отдать фронту закодированную строку после успешной авторизации
export interface IUserDataForAuth extends IID {
    name : string,
    last_name : string,
    email : string,
    group: string
}