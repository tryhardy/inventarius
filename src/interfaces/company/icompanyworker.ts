import { Dates, ID } from "../common"

//Интерфейс таблицы со списком сотрудников компаний
export interface ICompanyWorker extends ID, Dates {
    company_id: string, 
    name : string,
    last_name ?: string,
    post ?: string,
    user_id ?: string,
    active: boolean,
    role ?: string
}

//Интерфейс с параметрами для создания нового сотрудника
export interface ICompanyWorkerCreate {
    name : string,
    last_name ?: string,
    post ?: string,
    active: boolean,
}

//Интерфейс с параметрами для изменения сотрудника
export interface ICompanyWorkerUpdate {
    name : string,
    last_name ?: string,
    post ?: string,
    active: boolean,
    user_id ?: string,
    role ?: string
}

//Интерфейс таблицы со списком сотрудников компаний
export interface ICompanyWorkerFilter {
    company_id ?: string, 
    name ?: string,
    last_name ?: string,
    post ?: string,
    user_id ?: string,
    active ?: boolean,
    role ?: string
}