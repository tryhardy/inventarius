import { IEnumCompanyRole } from "../../enums/enum_company_role";
import { IDates } from "./idates";
import { IID } from "./iid";

//Интерфейс таблицы со списком ролей работников внутри компании
export interface IWorkerRoles extends IID, IDates {
    code: IEnumCompanyRole
}