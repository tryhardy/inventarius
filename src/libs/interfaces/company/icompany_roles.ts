import { IEnumCompanyRole } from "../enums/enum_company_role";
import { Dates, ID } from "../common"

export const CREATOR_COMPANY_ROLE = IEnumCompanyRole.admin;
export const DEFAULT_COMPANY_ROLE = IEnumCompanyRole.worker;

//Интерфейс таблицы со списком ролей работников внутри компании
export interface ICompanyRoles extends ID, Dates {
    code: IEnumCompanyRole
}