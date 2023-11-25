import { ICompany } from "../../models/companies/icompany";
import { IUser } from "../../models/iuser";
import { IWorker } from "../../models/iworker";

//Результат выполнения запроса создания пользователя
export interface IUserCreateResult {
    user ?: IUser,
    company ?: ICompany,
    worker ?: IWorker,
    token ?: string
}