//Фильтр по сотрудникам
export interface IWorkerFilter {
    company_id ?: string, 
    name ?: string,
    last_name ?: string,
    post ?: string,
    user_id ?: string,
    active ?: boolean,
    role ?: string,
    is_owner: boolean
}