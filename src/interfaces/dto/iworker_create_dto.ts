export interface IWorkerCreateDTO {
    name : string,
    last_name ?: string,
    post ?: string,
    active ?: boolean,
    company_id: string, 
    user_id ?: string,
    role_id ?: string,
    is_owner: boolean
}