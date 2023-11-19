import { CompanyRolesModel, CompanyRolesSchema } from "../models/company_roles";
import { Service } from "./service";

export class CompanyRolesService extends Service<CompanyRolesModel>
{
    constructor()
    {
        super(CompanyRolesSchema);
    }

    async getByCode(type = null) : Promise<CompanyRolesModel>
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