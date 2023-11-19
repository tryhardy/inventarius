import { IEnumCompanyType } from "../../../enums/enum_company_type";
import { IDates } from "../idates";
import { IID } from "../iid";

//Интерфейс таблицы со списком типов компаний
export interface ICompanyType extends IID, IDates {
    code: IEnumCompanyType
}