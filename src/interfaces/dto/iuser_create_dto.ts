//Создание пользователя
export interface IUserCreateDTO {
    name: string,
    last_name : string,
    email: string,
    password: string,
    group_id ?: string,
}