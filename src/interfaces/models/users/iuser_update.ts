//Изменение пользователя
export interface IUserUpdate {
    email ?: string,
    password ?: string,
    confirm_password ?: string,
    name ?: string,
    last_name ?: string,
}