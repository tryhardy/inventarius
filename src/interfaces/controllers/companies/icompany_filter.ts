//Интерфейс для фильтра по компаниям, чтобы получить список компаний
export interface ICompanyFilter {
    
    id ?: string|[string],
    type ?: string,
    name ?: string,
    address ?: string,
    creator ?: string,

    user ?: string,
    is_owner ?: boolean, //является владельцем
    is_worker ?: boolean, //является сотрудником (не владельцем!)
    worker_role ?: string|[string],
    
    active ?: boolean,
    
    limit ?: number,
    page ?: number
}