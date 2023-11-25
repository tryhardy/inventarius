import { IUserFilter } from "../interfaces/controllers/user/iuser_filter";
import { IPagination } from "../interfaces/services/ipagination";

export abstract class Service<T>
{
    model;

    constructor(schema)
    {
        this.model = schema;
    }

    async get() : Promise<T[]>
    {
        try {
            return await this.model.findAll({});
        }
        finally {}
    }

    async getById(id: string) : Promise<T>
    {
        try {
            let query = {
                where: {
                    id: id
                }
            };

            return await this.model.findOne(query);
        }
        finally {}
    }

    /**
     * Получить объект пагинации
     * @param limit 
     * @param page 
     * @param where 
     * @returns 
     */
    async getPagination(limit, page, where = {}, include = []) : Promise<IPagination>
    {
        let query = {
            where: where
        }
        let limitRows = limit > 0 && limit != undefined ? limit : 10;

        let offsetRows = 0;
        if (page > 0) {
            offsetRows = (page - 1) * limitRows;
        }
        else {
            page = 1;
            offsetRows = 0;
        }

        if (include.length > 0) {
            query['include'] = include;
        }

        query['limit'] = limitRows;
        query['offset'] = offsetRows; 

        let paginationResult = await this.model.findAndCountAll(query);

        let pagination : IPagination = {
            page: page,
            items: paginationResult.rows.length,
            limit: limitRows,
            offset: offsetRows,
            total_items: paginationResult.count,
            total_pages: Math.ceil(paginationResult.count / limitRows),
        };

        return pagination;
    }

    /**
     * Удалить запись из БД
     * @param id 
     * @returns 
     */
    async delete(id: string) : Promise<boolean>
    {
        try {
            let item = await this.model.findByPk(id);
            let result = false;

            if (item && item.id) {
                await item.destroy();
                result = true;
            }

            return result;
        }
        finally {}
    }
}