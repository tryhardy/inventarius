import { NextFunction } from 'express';
import { Body, Get, Controller, Next, Params, Post, Req, Response, Query, Delete } from "@decorators/express";
import { ValidationMiddleware } from "../middleware/validation";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { AppSuccess } from "../common/result/success";
import { GuardAuthMiddleware } from "../middleware/guard_auth";
import { AUTH_DATA_FIELD } from "../common/constants";
import { companyFilterSchema } from "../validation/schemas/company_filter_schema";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import { CompaniesService } from "../services/companies_service";
import { ICompanyFilter } from '../interfaces/controllers/companies/icompany_filter';
import { ICompanyCreate } from '../interfaces/controllers/companies/icompany_create';
import { companyCreateSchema } from '../validation/schemas/company_create_schema';
import { IUserCreateResult } from '../interfaces/controllers/user/iuser_create_result';
import { AppError } from '../common/result/error';
import { IEnumErrorCodes } from '../enums/error_codes';
import { WorkersService } from '../services/workers_service';
import { IWorkerCreateDTO } from '../interfaces/dto/iworker_create_dto';
import { ICompanyUpdate } from '../interfaces/controllers/companies/icompany_update';
import { IEnumCompanyRole } from '../enums/enum_company_role';
/**
 * Контроллер для работы с таблицей компаний
 */
@Controller('/company')
export class CompaniesController
{
    constructor() {}

    /**
     * Получить список компаний по фильтру
     * Только для авторизованных
     * Юзер с ролью "Клиент" может получить только те компании, в которых является овнером или сотрудником
     */
    @GuardAuthMiddleware()
    @ValidationMiddleware(companyFilterSchema, IEnumValidationTypes.query)
    @Get('/')
    async getAll(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Query() params : ICompanyFilter, @Next() next: NextFunction) 
    {
        try {
            let user = auth_data.user;

            let isClient = false;
            if (auth_data.group === IEnumUserGroups.client) {
                isClient = true;
            }

            // Если пользователь с ролью "Клиент", 
            // то он может фильтровать только свои компании
            if (isClient) {
                
                if (params.creator && params.creator != user.id) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED);
                }

                if (params.user && params.user != user.id) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED);
                }

                if (!params.user && !params.user) {
                    params.user = user.id;
                }
            }

            // Если фильтр по юзеру есть
            if (params.user) {
                // По умолчанию получаем все компании, в которых юзер является владельцем
                // Если не указано иное
                if (params.is_owner === undefined || params.is_owner === null) {
                    params.is_owner = true;
                }
    
                // По умолчанию получаем все компании, в которых юзер является сотрудником (Но не владельцем!)
                // Если не указано иное
                if (params.is_worker === undefined || params.is_worker === null) {
                    params.is_worker = true;
                }
            }

            const service = new CompaniesService;
            const serviceResult = await service.find(params)
    
            res.send(new AppSuccess(serviceResult));
        }
        catch(error) {
            next(error);
        }
    }
    
    /**
     * Получить конкретную компанию по ид
     * Только для авторизованных пользователей
     * Юзер с ролью "Клиент" может получить только те компании, в которых является овнером или сотрудником
     */
    @GuardAuthMiddleware()
    @Get('/:id')
    async getById(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('id') company_id : string, @Next() next: NextFunction) 
    {
        let errorMessage = 'Company not found';

        try {
            let user = auth_data.user;

            //Если пользователь с ролью "Клиент"
            if (auth_data.group === IEnumUserGroups.client) {

                //Пытается получить информацию не о своей компании
                let workerService = new WorkersService;
                let isCompanyWorkerOrCreator = await workerService.findOne({
                    user_id: user.id,
                    company_id: company_id
                });

                //Если работник не найден, значит он в этой компании не работает
                if (!isCompanyWorkerOrCreator || !isCompanyWorkerOrCreator['id']) {
                    throw new AppError(IEnumErrorCodes.NOT_FOUND, errorMessage)
                }

                //Проверяем роль работника
                if (!isCompanyWorkerOrCreator.is_owner) {
                    //Если это не админ, тогда смотрим, активный ли работник в этой компании
                    if (
                        isCompanyWorkerOrCreator['role']['code'] != IEnumCompanyRole.admin && 
                        !isCompanyWorkerOrCreator.active
                        ) {
                        throw new AppError(IEnumErrorCodes.NOT_FOUND, errorMessage)
                    }

                    //Если это не админ, тогда смотрим, активна ли сама компания
                    if (
                        isCompanyWorkerOrCreator['role']['code'] != IEnumCompanyRole.admin && 
                        !isCompanyWorkerOrCreator['company']['active']
                        ) {
                        throw new AppError(IEnumErrorCodes.NOT_FOUND, errorMessage) 
                    }
                }
            }

            const companiesService = new CompaniesService;
            const serviceResult = await companiesService.findById(company_id);

            if (!serviceResult) throw new AppError(IEnumErrorCodes.NOT_FOUND, errorMessage)
    
            res.send(new AppSuccess(serviceResult));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Создать компанию и первого неудаляемого (системного) работника в ней
     * только для авторизованных
     * Юзер с ролью "Клиент" может создать компанию только для себя
     */
    @GuardAuthMiddleware()
    @ValidationMiddleware(companyCreateSchema, IEnumValidationTypes.body)
    @Post('/create/:user_id')
    async create(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('user_id') user_id : string, @Body() params : ICompanyCreate, @Next() next: NextFunction) 
    {
        let errorMessage = 'Company was not created';
        let errorUserMessage = 'Wrong user data';

        try {
            let result : IUserCreateResult = {}
            let user = auth_data.user;
            let isClient = false;

            if (!user_id) {
                user_id = user.id;
            }

            if (auth_data.group === IEnumUserGroups.client) {
                isClient = true;
            }

            if (isClient && user_id !== user.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorUserMessage);
            }

            let service = new CompaniesService;
            let company = await service.create(params, user_id);

            if (!company || !company.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage);
            }

            result.company = company;

            let workerService = new WorkersService;
            let newWorkerCreateDTO : IWorkerCreateDTO = {
                name: user.name,
                last_name: user.last_name,
                post: 'Owner',
                active: true,
                company_id: company.id,
                user_id: user.id,
                is_owner: true
            }
            let worker = await workerService.create(newWorkerCreateDTO);

            if (!worker || !worker.id) {
                await company.destroy();
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage);
            }

            result.worker = worker;
            
            res.send(new AppSuccess(result));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Изменить компанию
     * только для авторизованных
     * Юзер с ролью "Клиент" может изменить только те компании, в которых является овнером или админом
     */
    @GuardAuthMiddleware()
    @Post('/:company_id')
    async update(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('company_id') company_id: string, @Body() params: ICompanyUpdate, @Next() next: NextFunction)
    {
        let errorMessage = 'Company not found';

        try {
            let user = auth_data.user;

            //Если пользователь с ролью "Клиент"
            if (auth_data.group == IEnumUserGroups.client) {
                //Ищем есть ли такой работник в компании
                let workerService = new WorkersService;
                let isCompanyWorkerOrCreator = await workerService.findOne({
                    user_id: user.id,
                    company_id: company_id
                });

                //Если работник не найден, значит он в этой компании не работает
                if (!isCompanyWorkerOrCreator || !isCompanyWorkerOrCreator['id']) {
                    throw new AppError(IEnumErrorCodes.NOT_FOUND, errorMessage)
                }

                //Проверяем роль работника
                //Если работник не имеет роль "Админ" внутри компании, и не является создателем, тогда не даем ему изменить компанию
                if (!isCompanyWorkerOrCreator.is_owner && isCompanyWorkerOrCreator['role']['code'] != IEnumCompanyRole.admin) {
                    throw new AppError(IEnumErrorCodes.NOT_FOUND, errorMessage);                 
                }
            }

            let company = await (new CompaniesService).update(company_id, params);
            res.send(new AppSuccess(company));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Удалить компанию
     * только для авторизованных
     * Доступно только для админа
     */
    @GuardAuthMiddleware([IEnumUserGroups.admin])
    @Delete('/:id')
    async delete(@Response() res, @Params('id') id: string, @Next() next: NextFunction)
    {
        //TODO может имеет смысл реализовать удаление через запрос в ТП?
        try {
            let service = new CompaniesService;
            let serviceResult = await service.delete(id);
            res.send(new AppSuccess({status: serviceResult}));
        }
        catch(error) {
            next(error);
        }
    }
}