//Изменение пользователя
export interface IUserUpdate {
    name ?: string,
    last_name ?: string,
    email ?: string,
    password ?: string,
    confirm_password ?: string,
    active ?: boolean,
    group ?: string,
}