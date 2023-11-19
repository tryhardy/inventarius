import { ICompanyCreate } from "../interfaces/models/companies/icompany_create";
import { ICompanyCreateDTO } from "../interfaces/models/companies/icompany_create_dto";
import { CompaniesModel, CompaniesSchema } from "../models/companies";
import { CompanyTypesService } from "./company_types_service";
import { Service } from "./service";

export class CompaniesService extends Service<CompaniesModel>
{
    constructor()
    {
        super(CompaniesSchema);
    }

    async create(params : ICompanyCreate) : Promise<CompaniesModel>
    {
        try {
            let companyTypes = new CompanyTypesService();
            let currentCompanyType = await companyTypes.getByCode(params.type);
            
            if (!currentCompanyType.id) {
                throw new Error('Company type not found in database')
            }

            let data : ICompanyCreateDTO = {
                type_id: currentCompanyType.id,
                active: false,
                creator: params.creator
            }

            return await this.model.create(data);
        }
        finally {}
    }
}