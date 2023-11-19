export interface IWorkerUpdate {
    name : string,
    last_name ?: string,
    post ?: string,
    active: boolean,
    user_id ?: string,
    role ?: string,
    is_owner: boolean
}