//Интерфейс для создания компании
//В таком виде мы отправляем данные в БД
export interface ICompanyCreateDTO {
    type_id: string,
    name ?: string,
    active : boolean,
    address ?: string
    creator : string,
}