import { ICompanyCreate } from "../company/icompany";
import { Dates, ID } from "../common";
import { IEnumUserGroups } from "../../enums/enum-user-groups";

export const DEFAULT_USER_GROUP = IEnumUserGroups.client;

//Интерфейс таблицы со списком ролей пользователей. По умолчанию новому пользователю присваивается роль "client"
export interface IUserGroups extends ID, Dates {
    code: IEnumUserGroups,
}