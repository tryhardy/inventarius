//Интерфейс для изменения компании
export interface ICompanyUpdate {
    type ?: string,
    name ?: string,
    active ?: boolean,
    address ?: string,
    creator ?: string
}
