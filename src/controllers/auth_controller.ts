import { IEnumSuccessCodes } from "../enums/success_codes";
import { NextFunction } from 'express';
import { Body, Controller, Next, Params, Post, Req, Response } from "@decorators/express";
import { ILogin } from "../interfaces/controllers/ilogin";
import { ValidationMiddleware } from "../middleware/validation";
import { loginSchema } from "../validation/schemas/login_schema";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { UsersService } from "../services/users_service";
import { JWT } from "../interfaces/common/jwt";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";
import { IUserDataForAuth } from "../interfaces/controllers/auth/iuser_data_for_auth";
import { AppSuccess } from "../common/result/success";
import { IAuthData } from "../interfaces/controllers/auth/iauth_data";
import { IUserCreate } from "../interfaces/models/users/iuser_create";
import { userCreateSchema } from "../validation/schemas/user_create_schema";
import { IEmailData } from "../interfaces/controllers/auth/iemail_data";
import { GuardAuthMiddleware } from "../middleware/guard_auth";
import { AUTH_DATA_FIELD } from "../common/constants";
import { emailSchema } from "../validation/schemas/email_schema";
import { IForgotPasswordResult } from "../interfaces/controllers/auth/iforgot_password_result";
import { changePasswordSchema } from "../validation/schemas/change_password_schema";
import { IPasswordData } from "../interfaces/controllers/auth/ipassword_data";
import { ChangePasswordService } from "../services/change_password_service";

@Controller('/auth')
export class AuthController
{
    changePasswordSecret = 'change_password';
    status = IEnumSuccessCodes.SUCCESS;

    /**
     * Авторизация
     */
    @ValidationMiddleware(loginSchema, IEnumValidationTypes.body)
    @Post('/login')
    async auth(@Response() res, @Body() params : ILogin, @Next() next: NextFunction)
    {
        try {
            let userService = new UsersService;
            let serviceResult = await userService.getByLogin(params.login);
            
            if (serviceResult) {
                // Проверяем пароль
                let check = serviceResult.validPassword(params.password);

                if (check === true) {

                    let userResult : IUserDataForAuth = {
                        id: serviceResult.id,
                        name: serviceResult.name,
                        last_name: serviceResult.last_name,
                        email: serviceResult.email,
                        group: serviceResult.group.code
                    }

                    let token = JWT.generateAccessToken(userResult);

                    let result : IAuthData = {
                        id: serviceResult.id,
                        access_token: token
                    };
    
                    res.send(new AppSuccess(result, '', this.status))
                }
            }
            
            throw new AppError(IEnumErrorCodes.UNAUTHORIZED, 'Login failed')
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Регистрация (с созданием новой компании)
     */
    @ValidationMiddleware(userCreateSchema, IEnumValidationTypes.body)
    @Post('/signup')
    async create(@Response() res, @Body() params : IUserCreate, @Next() next: NextFunction) 
    {
        try {
            let service = new UsersService();
            let serviceResult = await service.create(params);
            let result = new AppSuccess(serviceResult);
            
            res.status(this.status);
            res.send(result);
        }
        catch(error) {
            console.log(error)
            next(error);
        }
    }

    /**
     * Создать нового пользователя по хэшу с привязкой к ранее созданной компании
     * Создаем юзера и привязываем его к ранее созданному работнику
     */
    @ValidationMiddleware(userCreateSchema, IEnumValidationTypes.body)
    @Post('/signup/:hash')
    async createByHash(@Response() res, @Body() params : IUserCreate, @Params('hash') hash : string, @Next() next: NextFunction) 
    {
        res.status(this.status);
        res.send(hash);
    }
    
    /**
     * Отправить запрос на подтверждение пароля
     * TODO send Email with HASH
     */
    @GuardAuthMiddleware(false)
    @ValidationMiddleware(emailSchema, IEnumValidationTypes.body)
    @Post('/forgot_password')
    async forgot_password(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Body() params : IEmailData, @Next() next: NextFunction)
    {
        let result;
        let data : IForgotPasswordResult = {};
        
        let user = await (new UsersService).getByLogin(params.email);

        if (user) {
            //Генерируем токен
            let token = JWT.generateAccessToken(
                {
                    id: user.id
                },
                86400,
                this.changePasswordSecret
            );

            //todo отправляем на почту
            let send = false;

            //Если смену пароля запрашивает менеджер или админ, отдаем в ответе сразу хэш (для тестирования)
            //if (auth_data && (auth_data.group === IEnumUserGroups.admin || auth_data.group === IEnumUserGroups.manager)) {
                data.token = token;
                data.send = send;
                result = data;
            //}

        }
        
        res.send(new AppSuccess(result, 'Сообщение о смене пароля будет направлено на почту, если такой пользователь существует'))
    }

    /**
     * Восстановление пароля
     */
    @GuardAuthMiddleware(false)
    @ValidationMiddleware(changePasswordSchema, IEnumValidationTypes.body)
    @Post('/change_password/:hash')
    async change_password(@Response() res, @Req(AUTH_DATA_FIELD) auth_data, @Body() body : IPasswordData, @Params('hash') hash : string, @Next() next: NextFunction)
    {
        try {
            //Проверяем хэш в базе/
            //Если он уже там есть, тогда он уже был использован - не позволяем сменить пароль
            let changePasswordService = new ChangePasswordService;
            let isNewHash = await changePasswordService.check(hash);
            if (!isNewHash) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, 'Wrong hash data provided')
            }

            //Парсим hash в массив
            let hashData = JWT.verify(hash, this.changePasswordSecret);
            
            if (hashData && hashData.data && hashData.data.id) {
                //Записываем хеш в базу, чтобы его нельзя было повторно использовать
                let savedHash = await changePasswordService.save(hash);

                //Если хэш сохранился, тогда позволяем сменить пароль
                if (savedHash && savedHash.id) {
                    let id = hashData.data.id;
                    let userService = new UsersService;
                    let user = await userService.getById(id);

                    if (user && user.id) {
                        let result = await userService.update(id, {
                            password: body.password
                        })

                        if (result && result.id) {
                            res.send(new AppSuccess({}, 'Password was changed'));
                        }
                        else {
                            //Если по какой-то причине пароль не удалось сменить, удаляем тогда и хэш
                            await changePasswordService.delete(savedHash.id);
                        }
                    }
                }
            }
            
            throw new AppError(IEnumErrorCodes.BAD_REQUEST, 'Wrong hash data provided')
        }
        catch(error) {
            next(error);
        }
    }
}