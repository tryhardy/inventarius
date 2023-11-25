import { IPaginationFilter } from "../ipagination_filter";

export interface IUserFilter  extends IPaginationFilter
{
    id ?: string|[string],
    name ?: string,
    last_name ?: string,
    email ?: string,
    active ?: boolean,
    group ?: string,
}