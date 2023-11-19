import { IID } from "../models/iid";

// Такие данные фронт получает после успешной авторизации
export interface IAuthData {
    access_token: string
}

// Такие данные по пользователю нужны, чтобы сгенерировать JWT token, 
// и отдать фронту закодированную строку после успешной авторизации
export interface IUserDataForAuth extends IID {
    email ?: string,
    phone ?: string,
    name ?: string,
    last_name ?: string,
    date_login: string,
}

//Данные для авторизации на сайте и получения JWT token
export interface ILogin {
    login: string,
    password: string
}

//Используется для отправки инвайта на регистрацию
//Используется для восстановления пароля
export interface IEmailData {
    email: string,
}

//Данные для авторизации на сайте и получения JWT token
export interface IChangePassword {
    password: string,
    confirm_password: string,
}