//Интерфейс для создания компании
//В таком виде данные приходят с фронта
export interface ICompanyCreate {
    type: string,
    name ?: string,
    address ?: string
}