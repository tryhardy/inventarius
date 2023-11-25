import { Op } from "sequelize";
import { DEFAULT_COMPANY_ROLE } from "../common/constants";
import { AppError } from "../common/result/error";
import { IEnumCompanyRole } from "../enums/enum_company_role";
import { IEnumErrorCodes } from "../enums/error_codes";
import { IWorkerFilter } from "../interfaces/controllers/workers/iworker_filter";
import { IWorkerCreateDTO } from "../interfaces/dto/iworker_create_dto";
import { IWorkerUpdateDTO } from "../interfaces/dto/iworker_update_dto";
import { IListResult } from "../interfaces/services/ilist_result";
import { CompanyRolesSchema } from "../models/company_roles";
import { WorkersModel, WorkersSchema } from "../models/workers";
import { CompanyRolesService } from "./company_roles_service";
import { Service } from "./service";
import { CompaniesSchema } from "../models/companies";

export class WorkersService extends Service<WorkersModel>
{
    constructor()
    {
        super(WorkersSchema);
    }
    
    /**
     * Найти работников по фильтру
     * @param params 
     * @returns 
     */
    async find(params: IWorkerFilter = {}) : Promise<IListResult>
    {
        let search = this.getFilter(params);

        //Поиск по роли (через подзапрос ищем по коду группы, не по id)
        let userGroupQuery;
        if (params.role) {
            userGroupQuery = {
                code: params.role
            };
        }

        //Формируем пагинацию
        let pagination = await this.getPagination(params.limit, params.page, search)
        
        //Получаем список юзеров с фильтром
        let serviceResult = await this.model.findAndCountAll({
            limit: pagination.limit,
            offset: pagination.offset,
            where: search,
            include: [
                {
                    model: CompanyRolesSchema,
                    as: 'role',
                    where: userGroupQuery ?? {}
                },
                {
                    model: CompaniesSchema,
                    as: 'company',
                }
            ]
        });

        let result : IListResult = {
            items: serviceResult.rows,
            pagination: pagination.total_items > 0 ? pagination : {},
        }
        
        return result;
    }

    /**
     * Найти работника, если он является овнером и админом
     * @param params 
     * @returns 
     */
    async findOwnerOrAdmin(params: IWorkerFilter) : Promise<WorkersModel>
    {
        let errorMessageRoleNotFound = 'Admin company role not found';
        delete params.role;
        delete params.is_owner;

        let search = this.getFilter(params);

        //Поиск по роли (через подзапрос ищем по коду группы, не по id)
        let adminRole = await (new CompanyRolesService).getByCode(IEnumCompanyRole.admin);
        if (!adminRole) throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessageRoleNotFound)

        let searchOwner = {
            is_owner: true
        };
        let searchAdmin = {
            role_id: adminRole.id,
            is_owner: false
        };

        searchOwner = Object.assign(searchOwner, search);
        searchAdmin = Object.assign(searchAdmin, search);

        let newSearch = {
            [Op.or]: [
                searchOwner,
                searchAdmin
            ]
        }

        //Получаем список юзеров с фильтром
        return await this.model.findOne({
            where: newSearch,
            include: [
                {
                    model: CompanyRolesSchema,
                    as: 'role',
                },
                {
                    model: CompaniesSchema,
                    as: 'company',
                }
            ]
        });
    }

    /**
     * Найти одного работникапо фильтру
     * @param params 
     * @returns 
     */
    async findOne(params: IWorkerFilter = {}) : Promise<WorkersModel>
    {
        let search = this.getFilter(params);

        //Поиск по роли (через подзапрос ищем по коду группы, не по id)
        let userGroupQuery;
        if (params.role) {
            userGroupQuery = {
                code: params.role
            };
        }

        //Получаем список юзеров с фильтром
        return await this.model.findOne({
            where: search,
            include: [
                {
                    model: CompanyRolesSchema,
                    as: 'role',
                    where: userGroupQuery ?? {}
                },
                {
                    model: CompaniesSchema,
                    as: 'company',
                }
            ]
        });
    }

    getFilter(params: IWorkerFilter = {})
    {
        let search = {};

        if (params['company_id']) {
            search['company_id'] = params['company_id'];
        }
        
        //Поиск по id
        if(params.id) {
            if (String(params.id)) {
                search['id'] = params.id;
            }
            else if (Array(params.id)) {
                search['id'] = {
                    [Op.in]: params.id
                }
            }
        }

        //Поиск по имени - подстрока без учета регистра
        if (params.name) {
            search['name'] = {
                [Op.iLike]: '%' + params.name + '%'
            }
        }

        //Поиск по фамилии - подстрока без учета регистра
        if (params.last_name) {
            search['last_name'] = {
                [Op.iLike]: '%' + params.last_name + '%'
            }
        }

        //Поиск по должности - подстрока без учета регистра
        if (params.post) {
            search['post'] = {
                [Op.iLike]: '%' + params.post + '%'
            }
        }

        //Поиск по флагу активности
        if (params.active !== undefined) {
            search['active'] = params.active;
        }

        //Поиск по овнеру 
        if (params.is_owner !== undefined) {
            search['is_owner'] = params.is_owner;
        }

        //Поиск по овнеру 
        if (params.user_id !== undefined) {
            search['user_id'] = params.user_id;
        }

        return search;
    }
    

    /**
     * Создать работника
     * @param params 
     * @returns 
     */
    async create(params : IWorkerCreateDTO) : Promise<WorkersModel>
    {
        let errorRoleFoundMessage = 'User company role not found in database';
        let errorCreatingMessage = 'Worker does not created';

        try {

            let currentRole;

            if (!params.role_id) {
                let defaultRoleCode = params.is_owner === true ? IEnumCompanyRole.admin : DEFAULT_COMPANY_ROLE;               
                currentRole = await (new CompanyRolesService).getByCode(defaultRoleCode);

                if (!currentRole.id) {
                    throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorRoleFoundMessage);
                }
                
                params.role_id = currentRole.id
            }

            let data : IWorkerCreateDTO = {
                name : params.name ?? '',
                last_name : params.last_name ?? '',
                post : params.post ?? '',
                active: params.active ?? true,
                company_id: params.company_id, 
                user_id : params.user_id ?? null,
                role_id : params.role_id,
                is_owner: params.is_owner,
            }

            let result = await this.model.create(data);

            if (result) {
                return result;
            }
            else {
                throw new Error(errorCreatingMessage);
            }
        }
        finally {}
    }

    /**
     * Найти работника по ID
     * @param login 
     * @returns 
     */
    async getById(worker_id: string, company_id: string = null, active = null)
    {
        let where = {
            id: worker_id
        }

        if (company_id) {
            where['company_id'] = company_id;
        }

        if (active !== null && (active === true || active === false)) {
            where['active'] = active;
        }

        return await this.model.findOne({
            where: where,
            include: [
                {
                    model: CompanyRolesSchema,
                    as: 'role'
                },
                {
                    model: CompaniesSchema,
                    as: 'company'
                }
            ],
        });
    }

    /**
     * Обновить данные о работнике
     * @param id 
     * @param params 
     * @returns 
     */
    async update(id: string, params: IWorkerUpdateDTO)
    {
        let errorMessage = 'Worker not found';

        try {
            let worker = await this.getById(id);
            
            if (!worker || !worker.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage)
            }

            await worker.update(params)
            return await this.getById(id);
        }
        finally {}
    }
}