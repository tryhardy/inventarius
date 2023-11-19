//Интерфейс для фильтра по компаниям, чтобы получить список компаний
export interface ICompanyFilter {
    id ?: string|[string],
    type ?: string,
    name ?: string,
    address ?: string,
    creator ?: string   //Это поле должно быть обязательно заполнено текущим пользователем, если запрос отправляется пользователем с ролью IEnumUserGroups != admmin/manager
}