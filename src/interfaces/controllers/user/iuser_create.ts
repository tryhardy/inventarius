import { ICompanyCreate } from "../companies/icompany_create";

//Создание пользователя
export interface IUserCreate {
    name: string,
    last_name : string,
    email: string,
    password: string,
    confirm_password: string,
    group ?: string,
    company ?: ICompanyCreate,      //С созданием новой компании
    active ?: boolean
}