import { IPagination } from "./ipagination";

export interface IListResult {
    pagination ?: IPagination|{},
    items: [any]
}