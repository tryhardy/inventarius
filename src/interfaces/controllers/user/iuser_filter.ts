export interface IUserFilter {
    id ?: string|[string],
    name ?: string,
    last_name ?: string,
    email ?: string,
    active ?: boolean,
    group ?: string,

    limit ?: number,
    page ?: number
}