import { Op, Sequelize, literal } from "sequelize";
import { ICompanyCreate } from "../interfaces/controllers/companies/icompany_create";
import { ICompanyCreateDTO } from "../interfaces/dto/icompany_create_dto";
import { ICompanyFilter } from "../interfaces/controllers/companies/icompany_filter";
import { IListResult } from "../interfaces/services/ilist_result";
import { CompaniesModel, CompaniesSchema } from "../models/companies";
import { CompanyTypesService } from "./company_types_service";
import { Service } from "./service";
import { ICompanyTypesFilter } from "../interfaces/controllers/companies/icompany_types_filter";
import { CompanyTypesSchema } from "../models/company_types";
import { UsersSchema } from "../models/users";
import { WorkersSchema } from "../models/workers";
import { ICompanyUpdate } from "../interfaces/controllers/companies/icompany_update";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";

export class CompaniesService extends Service<CompaniesModel>
{
    companyErrorMessage = 'Company type not found in database';
    companyNotFoundErrorMessage = 'Company not found';
    
    constructor()
    {
        super(CompaniesSchema);
    }

    /**
     * Создать новую компанию
     * @param params 
     * @param creator_id 
     * @returns 
     */
    async create(params : ICompanyCreate, creator_id: string = null) : Promise<CompaniesModel>
    {
        try {
            let companyTypes = new CompanyTypesService();
            let currentCompanyType = await companyTypes.getByCode(params.type);
            
            if (!currentCompanyType.id) {
                throw new Error(this.companyErrorMessage)
            }

            let data : ICompanyCreateDTO = {
                type_id: currentCompanyType.id,
                active: true,
                creator_id: creator_id,
                name: params.name ?? null,
                address: params.address ?? null
            }

            return await this.model.create(data);
        }
        finally {}
    }

    async update(id: string, params: ICompanyUpdate)
    {
        try {
            let company = await this.findById(id);

            if (!company || !company.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, this.companyNotFoundErrorMessage)
            }

            return await company.update(params);
        }
        finally {}
    }

    /**
     * Найти компанию по ID компании (и ИД сотрудника)
     * @param id 
     * @param user_id 
     * @returns 
     */
    async findById(company_id: string, user_id: string = null) : Promise<CompaniesModel>
    {
        try {
            let query = {
                where: {
                    id: company_id
                },
                include: []
            };
            
            if (user_id) {
                
                let workerQuery = {
                    [Op.or]: [
                        {
                            user_id: user_id,
                            is_owner: true
                        },
                        {
                            user_id: user_id,
                            is_owner: false,
                            active: true
                        }
                    ]
                }

                query.include.push({
                    model: WorkersSchema,
                    as: 'worker',
                    where: workerQuery
                })
            }

            query.include.push({
                model: CompanyTypesSchema,
                as: 'type',
            });

            query.include.push({
                model: UsersSchema,
                as: 'creator',
                attributes: ['name', 'last_name']
            });

            return await this.model.findOne(query);
        }
        finally {}
    }

    /**
     * Найти компанию по фильтру
     * @param params 
     * @returns 
     */
    async find(params: ICompanyFilter = {}) : Promise<IListResult>
    {
        let search = {};
        
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
        if (params.address) {
            search['address'] = {
                [Op.iLike]: '%' + params.address + '%'
            }
        }

        //Поиск по создателю - подстрока без учета регистра
        if (params.creator) {
            search['creator_id'] = params.creator;
        }
    
        //Поиск по флагу активности
        if (params.active !== undefined) {
            search['active'] = params.active;
        }

        //Поиск по типу компании (через подзапрос ищем по коду группы, не по id)
        let companyTypeQuery : ICompanyTypesFilter = {};
        if (params.type) {
            companyTypeQuery['code'] = params.type;
        }

        let addWorkerQuery = false;
        let workerQuery = {}
        if (params.user) {
            if (params.is_owner === undefined) params.is_owner = true;
            if (params.is_worker === undefined) params.is_worker = true;

            if (params.is_owner === true) {
                addWorkerQuery = true;
                workerQuery = {
                    [Op.or]: [
                        {
                            user_id: params.user,
                            is_owner: true
                        }
                    ]
                }
            }

            if (params.is_worker === true) {
                addWorkerQuery = true;
                if (workerQuery[Op.or]) {
                    workerQuery[Op.or].push({
                        user_id: params.user,
                        is_owner: false,
                        active: true
                    })
                }
                else {
                    workerQuery = {
                        [Op.or]: [
                            {
                                user_id: params.user,
                                is_owner: false,
                                active: true
                            }
                        ]
                    }
                }
            }
        }

        let include = [];
        include.push({
            model: CompanyTypesSchema,
            as: 'type',
            where: companyTypeQuery
        })
        include.push({
            model: UsersSchema,
            as: 'creator',
            attributes: ['name', 'last_name']
        });

        if (addWorkerQuery) {
            include.push({
                model: WorkersSchema,
                as: 'worker',
                where: workerQuery
            })
        }

        //Если указан params.is_owner/params.is_worker
        if (params.is_worker && params.user) {
            let extendedSearch = {
                [Op.or] : []
            };

            //Работник может увидеть только те компании, в которых он активен
            let workerSearch = {
                active: true,
                creator_id: {
                    [Op.ne] : params.user
                }
            }

            //Овнер может увидеть все свои компании (и активные и неактивные)
            let ownerSearch = {
                creator_id: params.user
            }

            Object.assign(search, workerSearch, ownerSearch)
            extendedSearch[Op.or].push(workerSearch)

            //Владелец может видеть все свои компании (и активные и неактивные)
            if (params.is_owner) {
                extendedSearch[Op.or].push(ownerSearch)
            }

            search = extendedSearch;
        }
 
        //Формируем пагинацию
        let pagination = await this.getPagination(params.limit, params.page, search, include)

        //Получаем список юзеров с фильтром
        let serviceResult = await this.model.findAndCountAll({
            limit: pagination.limit,
            offset: pagination.offset,
            where: search,
            include: include,
        });

        let result : IListResult = {
            items: serviceResult.rows,
            pagination: pagination.total_items > 0 ? pagination : {},
        }

        return result;
    }
    
}