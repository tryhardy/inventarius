import { Body, Controller, Delete, Get, Next, Params, Post, Query, Req, Response } from "@decorators/express";
import { UsersService } from "../services/users_service";
import { ValidationMiddleware } from "../middleware/validation";
import { NextFunction } from 'express';
import { IUserCreate } from "../interfaces/models/users/iuser_create";
import { AppSuccess } from "../common/result/success";
import { userCreateSchema } from "../validation/schemas/user_create_schema";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { IUserFilter } from "../interfaces/controllers/user/iuser_filter";
import { IEnumSuccessCodes } from "../enums/success_codes";
import { IUserUpdate } from "../interfaces/models/users/iuser_update";
import { userFilterSchema } from "../validation/schemas/user_filter_schema";
import { GuardAuthMiddleware } from "../middleware/guard_auth";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import { AUTH_DATA_FIELD } from "../common/constants";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";

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
    @GuardAuthMiddleware(true, [IEnumUserGroups.admin, IEnumUserGroups.manager])
    @ValidationMiddleware(userFilterSchema, IEnumValidationTypes.query)
    @Get('/')
    async getAll(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Query() params : IUserFilter, @Next() next: NextFunction) 
    {
        try {
            const service = new UsersService();
            const serviceResult = await service.find(params);
            const result = new AppSuccess(serviceResult, '', this.status)
    
            res.status(this.status);
            res.send(result);
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
    @GuardAuthMiddleware(true)
    @ValidationMiddleware(userFilterSchema, IEnumValidationTypes.query)
    @Get('/:id')
    async get(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('id') id : string, @Next() next: NextFunction) 
    {
        try {
            //Если пользователь с ролью "Клиент"
            if (auth_data.group === IEnumUserGroups.client) {
                //Пытается получить информацию о другом юзере
                if (id !== auth_data.user.id) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, 'User not found')
                }
            }

            const service = new UsersService();
            const serviceResult = await service.getById(id);
            const result = new AppSuccess(serviceResult, '', this.status)
    
            res.status(this.status);
            res.send(result);
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Создать нового пользователя (без привязок к другим сущностям)
     * Доступно только для Админа
     */
    @GuardAuthMiddleware(true, [IEnumUserGroups.admin])
    @ValidationMiddleware(userCreateSchema, IEnumValidationTypes.body)
    @Post('/create')
    async create(@Response() res, @Body() params : IUserCreate, @Next() next: NextFunction) 
    {
        try {
            let service = new UsersService();
            let serviceResult = await service.create(params, false, false);
            let result = new AppSuccess(serviceResult);
            
            res.status(this.status);
            res.send(result);
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
    @GuardAuthMiddleware(true)
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

                //Пытается изменить группу
                if (body.group) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, 'You can\'t update user\'s group')
                }

                //Пытается изменить статус активности
                if (body.active) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, 'You can\'t update user\'s status')
                }
            }

            let service = new UsersService();
            let serviceResult = await service.update(id, body);
            let result = new AppSuccess(serviceResult);
            res.send(result);
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Удалить пользователя
     * Может только админ
     * @param res 
     * @param params 
     * @param id 
     * @param next 
     */
    @GuardAuthMiddleware(true, [IEnumUserGroups.admin])
    @Delete('/:id')
    async delete(@Response() res, @Params('id') id: string, @Next() next: NextFunction)
    {
        try {
            let service = new UsersService();
            let serviceResult = await service.delete(id);
            let result = new AppSuccess({status: serviceResult});
            res.send(result);
        }
        catch(error) {
            next(error);
        }
    }
}

