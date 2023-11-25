import { Body, Controller, Delete, Get, Next, Params, Post, Query, Req, Response } from "@decorators/express";
import { UsersService } from "../services/users_service";
import { ValidationMiddleware } from "../middleware/validation";
import { NextFunction } from 'express';
import { IUserCreate } from "../interfaces/controllers/user/iuser_create";
import { AppSuccess } from "../common/result/success";
import { userCreateSchema } from "../validation/schemas/user_create_schema";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { IUserFilter } from "../interfaces/controllers/user/iuser_filter";
import { IEnumSuccessCodes } from "../enums/success_codes";
import { IUserUpdate } from "../interfaces/controllers/user/iuser_update";
import { userFilterSchema } from "../validation/schemas/user_filter_schema";
import { GuardAuthMiddleware } from "../middleware/guard_auth";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import { AUTH_DATA_FIELD } from "../common/constants";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";
import { IUserCreateResult } from "../interfaces/controllers/user/iuser_create_result";
import { CompanyTypesService } from "../services/company_types_service";
import { ICompanyCreate } from "../interfaces/controllers/companies/icompany_create";
import { CompaniesService } from "../services/companies_service";
import { IWorkerCreateDTO } from "../interfaces/dto/iworker_create_dto";
import { WorkersService } from "../services/workers_service";
import { userUpdateSchema } from "../validation/schemas/user_update_schema";

/**
 * Контроллер для работы с таблицей пользователей
 */
@Controller('/user')
export class UsersController
{
    status = IEnumSuccessCodes.SUCCESS;

    constructor() {}

    /**
     * Получить список пользователей по фильтру
     * Доступно только для Манагера и Админа
     */
    @GuardAuthMiddleware([IEnumUserGroups.admin, IEnumUserGroups.manager])
    @ValidationMiddleware(userFilterSchema, IEnumValidationTypes.query)
    @Get('/')
    async getAll(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Query() params : IUserFilter, @Next() next: NextFunction) 
    {
        try {
            const service = new UsersService();
            const serviceResult = await service.find(params);
    
            res.status(this.status);
            res.send(new AppSuccess(serviceResult, '', this.status));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Получить информацию о конкретном пользователе
     * Доступно только для авторизованных
     * Пользователь с ролью "клиент" может получить информацию только о себе
     */
    @GuardAuthMiddleware()
    @Get('/:id')
    async getById(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('id') id : string, @Next() next: NextFunction) 
    {
        let errorMessage = 'User not found';

        try {
            //Если пользователь с ролью "Клиент"
            if (auth_data.group === IEnumUserGroups.client) {
                //Пытается получить информацию о другом юзере
                if (id !== auth_data.user.id) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, errorMessage)
                }
            }

            const service = new UsersService();
            const serviceResult = await service.getById(id);
    
            res.status(this.status);
            res.send(new AppSuccess(serviceResult, '', this.status));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Создать нового пользователя (без привязок к другим сущностям)
     * Доступно только для Админа
     */
    @GuardAuthMiddleware([IEnumUserGroups.admin])
    @ValidationMiddleware(userCreateSchema, IEnumValidationTypes.body)
    @Post('/create')
    async create(@Response() res, @Body() params : IUserCreate, @Next() next: NextFunction) 
    {
        try {
            let errorTypeCompanyMessage = 'Company type not provided';
            let errorCreateCompanyMessage = 'Company was not created';
            let errorCreateWorkerMessage = 'Worker was not created';
            let ownerPostName = 'Owner';

            let result : IUserCreateResult = {};
            let companyType;
            let userService = new UsersService();

            if (!params.company || !params.company.type) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, '', {error: errorTypeCompanyMessage})
            }

            //Проверяем, существует ли в БД указанный тип компании (ЮЛ/ФЛ)
            companyType = await (new CompanyTypesService).getByCode(params.company.type);
            if (!companyType.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, '', {error: errorTypeCompanyMessage})
            }
    
            let user = await userService.create(params);
  
            if (user) {
                result.user = await userService.getById(user.id);
            }

            //Создаем компанию, привязанную к этому пользователю
            let companyCreateData : ICompanyCreate = {
                type: params.company.type
            }

            let companyService = new CompaniesService;
            let company = await companyService.create(companyCreateData, user.id);
            result.company = company;

            if (!company.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, '', {error: errorCreateCompanyMessage})
            }

            //Если компания создалась, создаем в ней первого сотрудника (овнера)
            let workerData : IWorkerCreateDTO = {
                name: user.name,
                last_name: user.last_name ?? '',
                company_id: company.id,
                post: ownerPostName,
                active: true,
                is_owner: true,
                user_id: user.id
            }

            let worker = await (new WorkersService).create(workerData);

            if (!worker) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, '', {error: errorCreateWorkerMessage})
            }

            result.worker = worker;
            
            res.send(new AppSuccess(result));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Изменить пользователя
     * Доступно только для авторизованных
     * Юзер с ролью "клиент" может менять только свой профиль 
     * Юзер с ролью "клиент" не может менять свою группу и флаг активности
     * 
     * @param res 
     * @param params 
     * @param id 
     * @param next 
     */
    @GuardAuthMiddleware()
    @ValidationMiddleware(userUpdateSchema, IEnumValidationTypes.body)
    @Post('/:id')
    async update(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Body() body : IUserUpdate, @Params('id') id: string, @Next() next: NextFunction)
    {
        try {
            //Если пользователь с ролью "Клиент"
            if (auth_data.group === IEnumUserGroups.client) {
                //пытается изменить профиль другого пользователя
                if (auth_data.user.id != id) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, 'User not found')
                }
                
                //TODO Если пользователь пытается сменить email, позволять ли ему это сделать? Нужно ли подтверждение по email в таком случае? Деактивировать ли юзера, пока он не подивердит почту?
                //TODO реализовать форму запроса на изменение почты в ТП для клиентов (в отдельном контроллере!)

                //Пытается изменить группу
                if (body.group) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, 'You can\'t update user\'s group')
                }

                //Пытается изменить статус активности
                if (typeof body.active === 'boolean') {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, 'You can\'t update user\'s status')
                }
            }

            let service = new UsersService();
            let serviceResult = await service.update(id, body);
            res.send(new AppSuccess(serviceResult));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Удалить пользователя
     * Может только админ
     * 
     * @param res 
     * @param params 
     * @param id 
     * @param next 
     */
    @GuardAuthMiddleware([IEnumUserGroups.admin])
    @Delete('/:id')
    async delete(@Response() res, @Params('id') id: string, @Next() next: NextFunction)
    {
        //TODO реализовать форму запроса на удаление в ТП для клиентов (в отдельном контроллере!)
        try {
            let service = new UsersService();
            let serviceResult = await service.delete(id);
            res.send(new AppSuccess({status: serviceResult}));
        }
        catch(error) {
            next(error);
        }
    }
}

