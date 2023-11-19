import { IUserCreate } from "../interfaces/models/users/iuser_create";
import { DEFAULT_USER_GROUP } from "../common/constants";
import { UsersModel, UsersSchema } from "../models/users";
import { Service } from "./service";
import { UserGroupsService } from "./usergroups_service";
import { IUserCreateResult } from "../interfaces/controllers/iuser_create_result";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes as ErrorCodes } from "../enums/error_codes";
import { CompanyTypesService } from "./company_types_service";
import { ICompanyCreate } from "../interfaces/models/companies/icompany_create";
import { CompaniesService } from "./companies_service";
import { IWorkerCreateDTO } from "../interfaces/models/workers/iworker_create_dto";
import { WorkersService } from "./workers_service";

export class UsersService extends Service<UsersModel>
{
    constructor()
    {
        super(UsersSchema);
    }

    /**
     * Базовый метод, который просто создает нового пользователя в БД
     * без привязки к остальным сущностям
     * @param params 
     * @returns 
     */
    async create(params : IUserCreate) : Promise<UsersModel>
    {
        try {

            if (!params.group_id) {
                let userGroups = new UserGroupsService();
                let defaultUserGroup = await userGroups.getByCode(DEFAULT_USER_GROUP);
   
                if (!defaultUserGroup.id) {
                    throw new Error('Default user group not found in database')
                }

                params.group_id = defaultUserGroup.id;
            }

            return await this.model.create(params);
        }
        finally {}
    }

    /**
     * Создает пользователя
     * к этому пользователю создает компанию
     * к этой компании создает неудаляемого работника (владельца)
     * 
     * @param params 
     * @param createWorker 
     * @returns 
     */
    async createNewUser(params : IUserCreate, createCompany = true, createWorker = true)
    {
        let result : IUserCreateResult = {};

        if (!params.company.type) {
            throw new AppError(ErrorCodes.BAD_REQUEST, '', {error: "Company type not provided"})
        }

        let companyType;

        if (createCompany) {
            //Проверяем, существует ли в БД указанный тип компании (ЮЛ/ФЛ)
            companyType = await (new CompanyTypesService).getByCode(params.company.type);
            if (!companyType.id) {
                throw new AppError(ErrorCodes.BAD_REQUEST, '', {error: "Company type not found"})
            }
        }

        //Создаем пользователя
        let userService = new UsersService;
        let user = await userService.create(params);

        if (user.id && createCompany) {
            result.user = user;

            //Создаем компанию, привязанную к этому пользователю
            let companyCreateData : ICompanyCreate = {
                type: params.company.type,
                creator: user.id
            }
            let companyService = new CompaniesService;
            let company = await companyService.create(companyCreateData);

            result.company = company;

            if (!company.id) {
                throw new AppError(ErrorCodes.BAD_REQUEST, '', {error: "Company was not created"})
            }

            if (createWorker) {
                //Если компания создалась, создаем в ней первого сотрудника (овнера)
                let workerData : IWorkerCreateDTO = {
                    name: user.name,
                    last_name: user.last_name ?? '',
                    company_id: company.id,
                    post: 'Owner',
                    active: true,
                    is_owner: true,
                    user_id: user.id
                }

                let workerService = new WorkersService;

                let worker = await workerService.create(workerData);

                result.worker = worker;
            }
    
        }

        return result;
    }
}