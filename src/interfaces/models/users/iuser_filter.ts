export interface IUserFilter {
    id ?: string|[string],
    name ?: string,
    last_name ?: string,
    email ?: string,
    active ?: boolean,
    date_login ?: string,
    group ?: string
}