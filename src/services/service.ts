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
}