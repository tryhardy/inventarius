import { IPaginationFilter } from "../ipagination_filter";

//Фильтр по сотрудникам
export interface IWorkerFilter extends IPaginationFilter
{
    id ?: string|[string];
    name ?: string;
    last_name ?: string;
    is_owner ?: boolean;
    post ?: string;
    active ?: boolean;
    role ?: string;
    company_id ?: string;
    user_id ?: string,
} 