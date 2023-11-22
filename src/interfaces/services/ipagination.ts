export interface IPagination {
    page: number,
    items: number,
    limit: number,
    offset: number
    total_items: number,
    total_pages: number,
}