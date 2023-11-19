//Создание нового сотрудника
export interface IWorkerCreate {
    name : string,
    last_name ?: string,
    post ?: string,
    active: boolean,
    is_owner: boolean
}