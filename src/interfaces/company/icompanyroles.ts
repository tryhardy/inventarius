import { IEnumCompanyRoles } from "../../enums/enum-company-roles";
import { Dates, ID } from "../common"

export const CREATOR_COMPANY_ROLE = IEnumCompanyRoles.admin;
export const DEFAULT_COMPANY_ROLE = IEnumCompanyRoles.worker;

//Интерфейс таблицы со списком ролей работников внутри компании
export interface ICompanyRoles extends ID, Dates {
    code: IEnumCompanyRoles
}