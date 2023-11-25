//Создание нового сотрудника
export interface IWorkerCreate {
    name : string,
    last_name ?: string,
    post ?: string,
    role ?: string
}