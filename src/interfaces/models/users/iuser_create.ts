import { ICompanyCreate } from "../companies/icompany_create";
import { IWorkerUpdate } from "../workers/iworker_update";

//Создание пользователя
export interface IUserCreate {
    name: string,
    last_name : string,
    email: string,
    password: string,
    confirm_password: string,
    group_id ?: string,
    company ?: ICompanyCreate,      //С созданием новой компании
}