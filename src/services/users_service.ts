import { IUserCreate } from "../interfaces/controllers/user/iuser_create";
import { DEFAULT_USER_GROUP } from "../common/constants";
import { UsersModel, UsersSchema } from "../models/users";
import { Service } from "./service";
import { UserGroupsService } from "./user_groups_service";
import { IUserCreateResult } from "../interfaces/controllers/user/iuser_create_result";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes as ErrorCodes } from "../enums/error_codes";
import { CompanyTypesService } from "./company_types_service";
import { ICompanyCreate } from "../interfaces/controllers/companies/icompany_create";
import { CompaniesService } from "./companies_service";
import { IWorkerCreateDTO } from "../interfaces/dto/iworker_create_dto";
import { WorkersService } from "./workers_service";
import { IUserFilter } from "../interfaces/controllers/user/iuser_filter";
import { Op } from "../../node_modules/sequelize";
import { IListResult } from "../interfaces/services/ilist_result";
import { UserGroupsSchema } from "../models/user_groups";
import { IUSerGroupsFilter } from "../interfaces/controllers/user/isuer_groups_filter";
import { IUserUpdate } from "../interfaces/controllers/user/iuser_update";
import { IUserUpdateDTO } from "../interfaces/dto/iuser_update_dto";
import { IUserCreateDTO } from "../interfaces/dto/iuser_create_dto";

export class UsersService extends Service<UsersModel>
{
    protected static include = {
        model: UserGroupsSchema,
        as: 'group'
    }

    constructor() 
    {
        super(UsersSchema);
    }

    /**
     * Найти юзеров по фильтру
     * @param params 
     * @returns 
     */
    async find(params: IUserFilter = {}) : Promise<IListResult>
    {
        let search = this.getFilter(params);

        //Поиск по группе (через подзапрос ищем по коду группы, не по id)
        let userGroupQuery : IUSerGroupsFilter = {};
        if (params.group) {
            userGroupQuery.code = params.group;
        }

        //Формируем пагинацию
        let pagination = await this.getPagination(params.limit, params.page, search)
  
        //Получаем список юзеров с фильтром
        let serviceResult = await this.model.findAndCountAll({
            limit: pagination.limit,
            offset: pagination.offset,
            where: search,
            include: {
                model: UserGroupsSchema,
                as: 'group',
                where: userGroupQuery
            }
        });

        let result : IListResult = {
            items: serviceResult.rows,
            pagination: pagination.total_items > 0 ? pagination : {},
        }

        return result;
    }

    /**
     * Найти юзеров по фильтру
     * @param params 
     * @returns 
     */
    async findOne(params: IUserFilter = {}) : Promise<UsersModel>
    {
        let search = this.getFilter(params);

        //Поиск по группе (через подзапрос ищем по коду группы, не по id)
        let userGroupQuery : IUSerGroupsFilter = {};
        if (params.group) {
            userGroupQuery.code = params.group;
        }
    
        //Получаем список юзеров с фильтром
        return await this.model.findOne({
            where: search,
            include: {
                model: UserGroupsSchema,
                as: 'group',
                where: userGroupQuery
            }
        });
    }

    getFilter(params)
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
        if (params.last_name) {
            search['last_name'] = {
                [Op.iLike]: '%' + params.last_name + '%'
            }
        }

        //Поиск по email - подстрока без учета регистра
        if (params.email) {
            search['email'] = {
                [Op.iLike]: '%' + params.email + '%'
            }
        }
    
        //Поиск по флагу активности
        if (params.active !== undefined) {
            search['active'] = params.active;
        }

        return search;
    }

    /**
     * Найти юзера по логину (по умолчанию ищет только активных юзеров)
     * @param login 
     * @returns 
     */
    async getByLogin(login: string, active = true)
    {
        let where = {
            email: login
        };

        if (typeof active == "boolean") {
            where['active'] = active;
        }

        let user = await this.model.findOne({
            where: where,
            attributes: ['id', 'name', 'last_name', 'email', 'group_id', 'salt', 'password'],
            include: UsersService.include,
        })

        return user;
    }

    /**
     * Найти юзера по  ID
     * @param login 
     * @returns 
     */
    async getById(id: string, active = null, attributes = ['id', 'name', 'last_name', 'email', 'group_id', 'active'])
    {
        let where = {
            id: id
        }

        if (typeof active == "boolean") {
            where['active'] = active;
        }

        let user = await this.model.findOne({
            where: where,
            attributes: attributes,
            include: UsersService.include,
        })

        return user;
    }

    /**
     * Базовый метод, который просто создает нового пользователя в БД
     * без привязки к остальным сущностям (сотрудники, компании)
     * @param params 
     * @returns 
     */
    async create(params : IUserCreate) : Promise<UsersModel>
    {
        try {
            let errorMessage = 'Default user group not found in database';
            let userGroupCode = params.group ?? DEFAULT_USER_GROUP;
            let userData : IUserCreateDTO = {
                name: params.name,
                last_name: params.last_name,
                email: params.email,
                password: params.password
            }
            let userGroups = new UserGroupsService();
            let defaultUserGroup = await userGroups.getByCode(userGroupCode);
   
            if (!defaultUserGroup.id) {
                throw new Error(errorMessage)
            }

            userData.group_id = defaultUserGroup.id;

            return await this.model.create(userData);
        }
        finally {}
    }

    /**
     * Изменяет пользователя
     * @param id 
     * @param params 
     * @returns 
     */
    async update(id: string, params: IUserUpdate) : Promise<UsersModel>
    {
        try {
            let user = await this.model.findByPk(id, {
                include: {
                    model: UserGroupsSchema,
                    as: 'group'
                }
            });

            if (!user) {
                throw new AppError(ErrorCodes.BAD_REQUEST, 'User not found');
            }

            let updateParamsDTO : IUserUpdateDTO = {}
            
            //Обновляем имя
            if (params.name) {
                updateParamsDTO.name = params.name;
            }

            //Обновляем фамилию
            if (params.last_name) {
                updateParamsDTO.last_name = params.last_name;
            }

            //Обновляем email
            if (params.email) {
                updateParamsDTO.email = params.email;
            }

            //Обновляем пароль
            if (params.password) {
                updateParamsDTO.password = params.password;
            }

            //Обновляем флаг активности
            if (params.active) {
                updateParamsDTO.active = params.active;
            }

            //Обновляем группу по коду
            let group;
            if (params.group) {
                let groupService = new UserGroupsService;
                group = await groupService.getByCode(params.group);

                if (group && group.id) {
                    updateParamsDTO.group_id = group.id;
                    user.group.id =  group.id;
                }
            }

            await user.update(updateParamsDTO);

            user = await this.getById(id)

            return user;
        }
        finally {}
    }
}