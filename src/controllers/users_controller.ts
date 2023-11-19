import { Body, Controller, Get, Next, Params, Post, Response } from "@decorators/express";
import { UsersService } from "../services/users_service";
import { ValidationMiddleware } from "../middleware/validation";
import { NextFunction } from 'express';
import { IUserCreate } from "../interfaces/models/users/iuser_create";
import { AppSuccess } from "../common/result/success";
import { userSchema } from "../validation/schemas/user_schema";
import { IEnumValidationTypes } from "../enums/enum_validation";

@Controller('/user')
export class UsersController
{
    status = 200;

    constructor() {}

    /**
     * Получить список пользователей 
     * TODO по фильтру
     */
    @Get('/')
    async getAll(@Response() res, @Body() params, @Next() next: NextFunction) 
    {
        try {
            const service = new UsersService();
            const serviceResult = await service.get();
            const result = new AppSuccess(serviceResult, '', this.status)
    
            res.status(this.status);
            res.send(result);
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Создать нового пользователя
     */
    @ValidationMiddleware(userSchema, IEnumValidationTypes.body)
    @Post('/create')
    async create(@Response() res, @Body() params : IUserCreate, @Next() next: NextFunction) 
    {
        try {
            //Валидация входящих параметров
            //Если с фронта пришло что-то не то, возвращаем ошибку
            // const errors = new RequestValidation(req).getErrors();
            // if (errors) {
            //     throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Validation error', errors)
            // }

            let service = new UsersService();
            let serviceResult = await service.createNewUser(params);
            let result = new AppSuccess(serviceResult);
            
            res.status(this.status);
            res.send(result);
        }
        catch(error) {
            next(error);
        }
    }
}

