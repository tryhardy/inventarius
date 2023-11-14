import { ICompanyTypes } from "../interfaces/company/icompanytypes";
import { CompanyTypesModel } from "../models/company_types";
import { Service } from "./service";

export class CompanyTypesService  extends Service
{
    model;

    constructor()
    {
        super();
        this.model = CompanyTypesModel;
    }

    async get(type = null) : Promise<ICompanyTypes>
    {
        let query = {
            where: {}
        };

        if (type) query.where['code'] = type;

        return await this.model.findOne(query);
    }
}