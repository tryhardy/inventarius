import { IEnumCompanyType } from "../enums/enum_company_type";
import { Dates, ID } from "../common"

export const CREATOR_COMPANY_TYPE = IEnumCompanyType.company;

//Интерфейс таблицы со списком типов компаний
export interface ICompanyTypes extends ID, Dates {
    code: IEnumCompanyType
}