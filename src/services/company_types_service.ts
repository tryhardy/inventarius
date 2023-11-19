import { CompanyTypesModel, CompanyTypesSchema } from "../models/company_types";
import { Service } from "./service";

export class CompanyTypesService extends Service<CompanyTypesModel>
{
    constructor()
    {
        super(CompanyTypesSchema);
    }

    async getByCode(type = null) : Promise<CompanyTypesModel>
    {
        let query = {
            where: {
                code: type
            }
        };

        let result = await this.model.findOne(query);

        return result;
    }
}