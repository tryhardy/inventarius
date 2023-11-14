import { ICompany, ICompanyCreate } from "../company/icompany";
import { Dates, ID } from "../common";
import { ICompanyWorkerUpdate } from "../company/icompanyworker";
import { IEnumUserGroups } from "../enums/enum-user-groups";

//Интерфейс таблицы со списком пользователей
export interface IUser extends ID, Dates {
    name: string,
    last_name : string,
    email: string,
    password: string,
}

//Интерфейс таблицы со списком ролей пользователей. По умолчанию новому пользователю присваивается роль "client"
export interface IUserGroups extends ID, Dates {
    code: IEnumUserGroups,
}

//Простой интерфейс создания пользователя (без создания новой компании/без привязки к таблице сотрудников)
export interface IUserCreateBase {
    name: string,
    last_name : string,
    email: string,
    password: string,
    confirm_password: string,
}

//Интерфейс для создания нового пользователя с нуля (не по ссылке-приглашению)
export interface IUserCreate extends IUserCreateBase {
    company ?: ICompanyCreate,
}

//Интерфейс для создания нового пользователя по ссылке-приглашению
export interface IUserCreateByInvite extends IUserCreateBase {
    worker : ICompanyWorkerUpdate,
}

//Интерфейс изменения пользователя
export interface IUserUpdate {
    email ?: string,
    password ?: string,
    confirm_password ?: string,
    name ?: string,
    last_name ?: string,
}

//Интерфейс для фильтра по пользователям, чтобы получить список юзеров
//Список юзеров может получить только пользователь с ролью IEnumUserGroups == admmin|manager
export interface IUserFilter {
    id ?: string|[],
    name ?: string,
    last_name ?: string,
    email ?: string,
    active ?: boolean,
    date_login ?: string,
    group ?: string
}