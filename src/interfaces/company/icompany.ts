import { IEnumCompanyType } from "../../enums/enum-company-type"
import { Dates, ID } from "../common"

//Интерфейс таблицы со списком компаний
export interface ICompany extends ID, Dates {
    type: IEnumCompanyType,
    name ?: string,
    address ?: string
    creator : string,
}

//Интерфейс для создания компании
export interface ICompanyCreate {
    type: string,
    name ?: string,
    address ?: string,
    creator ?: string
}

//Интерфейс для изменения компании
export interface ICompanyUpdate {
    type : string,
    name ?: string,
    address ?: string
}

//Интерфейс для фильтра по компаниям, чтобы получить список компаний
export interface ICompanyFilter {
    id ?: string|[],
    type ?: string,
    name ?: string,
    address ?: string,
    creator ?: string   //Это поле должно быть обязательно заполнено текущим пользователем, если запрос отправляется пользователем с ролью IEnumUserGroups != admmin/manager
}