import { ICompany } from "../models/companies/icompany";
import { IUser } from "../models/users/iuser";
import { IWorker } from "../models/workers/iworker";

//Результат выполнения запроса создания пользователя
export interface IUserCreateResult {
    user ?: IUser,
    company ?: ICompany,
    worker ?: IWorker
}