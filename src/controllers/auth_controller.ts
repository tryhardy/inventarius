import { IEnumSuccessCodes } from "../enums/success_codes";
import { NextFunction } from 'express';
import { Body, Controller, Next, Params, Post, Req, Response, Res } from "@decorators/express";
import { ILogin } from "../interfaces/controllers/auth/ilogin";
import { ValidationMiddleware } from "../middleware/validation";
import { loginSchema } from "../validation/schemas/login_schema";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { UsersService } from "../services/users_service";
import { JWT } from "../common/jwt";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";
import { IUserDataForAuth } from "../interfaces/controllers/auth/iuser_data_for_auth";
import { AppSuccess } from "../common/result/success";
import { IAuthData } from "../interfaces/controllers/auth/iauth_data";
import { IUserCreate } from "../interfaces/controllers/user/iuser_create";
import { userCreateSchema } from "../validation/schemas/user_create_schema";
import { IEmailData } from "../interfaces/controllers/auth/iemail_data";
import { JWT_CHANGE_PASSWORD_SECRET, JWT_CONFIRM_EMAIL_SECRET, JWT_INVITE_WORKER_SECRET, JWT_TIME_CHANGE_PASSWORD_SECRET, JWT_TIME_CONFIRM_EMAIL_SECRET } from "../common/constants";
import { emailSchema } from "../validation/schemas/email_schema";
import { IForgotPasswordResult } from "../interfaces/controllers/auth/iforgot_password_result";
import { changePasswordSchema } from "../validation/schemas/change_password_schema";
import { IPasswordData } from "../interfaces/controllers/auth/ipassword_data";
import { HashService } from "../services/hash_service";
import { IUserCreateResult } from "../interfaces/controllers/user/iuser_create_result";
import { CompanyTypesService } from "../services/company_types_service";
import { ICompanyCreate } from "../interfaces/controllers/companies/icompany_create";
import { CompaniesService } from "../services/companies_service";
import { IWorkerCreateDTO } from "../interfaces/dto/iworker_create_dto";
import { WorkersService } from "../services/workers_service";
import { debug } from "../app";

@Controller('/auth')
export class AuthController
{
    changePasswordSecret = JWT_CHANGE_PASSWORD_SECRET;
    confirmRegisterSecret = JWT_CONFIRM_EMAIL_SECRET;
    status = IEnumSuccessCodes.SUCCESS;

    //TODO Система должна регистрировать каждую неудачную попытку входа с указанием времени и IP-адреса. 
    // При достижении определенного числа последовательных (попытки сделанные в промежутке 5 минут) неудачных попыток входа:
    // После 2-ой неудачной попытки: Показывать предупреждение о блокировке после 2-ой неудачной попытке входа в течении 5 минут.
    // После 5 попыток входа: Блокировать возможность повторного входа на 5 минут., Отправить уведомление на электронную почту Администратора компании, Отправить уведомление на электронную почту, привязанную к аккаунту в который пытаются войти
    /**
     * Авторизация по логину и паролю
     * Залогиниться могут только активные пользователи, которые подтвердили свой email
     */
    @ValidationMiddleware(loginSchema, IEnumValidationTypes.body)
    @Post('/login')
    async login(@Res() res, @Body() params : ILogin, @Next() next: NextFunction)
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
                        user_id: serviceResult.id,
                        access_token: token
                    };
    
                    res.send(new AppSuccess(result, '', this.status))
                }
                else {
                    throw new AppError(IEnumErrorCodes.UNAUTHORIZED, 'Login failed')
                }
            }
            else {
                throw new AppError(IEnumErrorCodes.UNAUTHORIZED, 'Login failed')
            }            
        }
        catch (error) {
            next(error);
        }
    }

    /**
     * Регистрация (с созданием новой компании и первого неудаляемого сотрудника в ней (овнера))
     * По умолчанию юзер деактивирован. Чтобы стать активным и залогиниться, ему нужно подтвердить почту
     */
    @ValidationMiddleware(userCreateSchema, IEnumValidationTypes.body)
    @Post('/signup')
    async signup(@Res() res, @Body() params : IUserCreate, @Next() next: NextFunction) 
    {
        try {
            if (params.active != undefined) delete params.active
            if (params.group != undefined) delete params.group

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

            //TODO SEND EMAIL Генерируем токен для подтверждения EMAIL и отправляем на почту ссылку
            let token = JWT.generateAccessToken(
                {id: user.id},
                360000,
                this.confirmRegisterSecret
            );

            //Если включен DEBUG, возвращаем в запросе код токена для подтверждения EMAIL
            if (debug) {
                result.token = token;
            }
            
            res.send(new AppSuccess(result));
        }
        catch(error) {
            next(error)
        }
    }

    /**
     * Создать нового пользователя по хэшу с привязкой к ранее созданной компании
     */
    @ValidationMiddleware(userCreateSchema, IEnumValidationTypes.body)
    @Post('/signup/:hash')
    async signupByHash(@Res() res, @Body() params : IUserCreate, @Params('hash') hash : string, @Next() next: NextFunction) 
    {
        if (params.active != undefined) delete params.active
        if (params.group != undefined) delete params.group

        let errorCreateUserMessage = 'User was not created!';
        let errorWorkerFindMessage = 'Worker not found or has been already invited';

        try {
            let workerService = new WorkersService;
            let hashService = new HashService;
            let userService = new UsersService;
            let result;

            //Парсим hash в массив (если такой хеш уже был использован, возвращаем ошибку)
            let data = await hashService.verify(hash, JWT_INVITE_WORKER_SECRET);
            let hashData = data.data;

            //Проверяем, есть ли такой работник в базе (а еще проверяем, привязан ли к нему реальный пользователь)
            let worker = await workerService.findOne({id: hashData.worker_id, user_id: null, active: true});

            if (!worker || worker.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorWorkerFindMessage)
            }

            //Создаем пользователя
            let user = await userService.create(params);
            if (user) {
                result.user = await userService.getById(user.id);
            }
            else {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorCreateUserMessage)
            }


            result.worker = await workerService.update(worker.id, {user_id: user.id});

            //TODO SEND EMAIL Генерируем токен для подтверждения EMAIL и отправляем на почту ссылку
            let token = JWT.generateAccessToken(
                {id: user.id},
                JWT_TIME_CONFIRM_EMAIL_SECRET,
                this.confirmRegisterSecret
            );

            //Если включен DEBUG, возвращаем в запросе код токена для подтверждения EMAIL
            if (debug) {
                result.token = token;
            }

            res.send(new AppSuccess(result));
        }
        catch(error) {
            next(error)
        }
    }

    /**
     * Подтверждение регистрации
     * Если пользователь зарегистрировался на портале, то он по емайлу получает ссылку на подтверждение регистрации
     * После перехода по этой ссылке, пользователь становится активным
     */
    @Post('/confirm/:hash')
    async confirmEmail(@Res() res, @Params('hash') hash : string, @Next() next: NextFunction) 
    {
        let successMessage = 'Email was confirmed';
        let errorUpdateUserMessage = 'User not updated';
        let errorHashMessage = 'Hash was already used';
        let errorAlreadyConfirmed = 'User was already confirmed';

        try {
            let hashService = new HashService;
            let userService = new UsersService;

            //Парсим hash в массив (если такой хеш уже был использован, возвращаем ошибку)
            let hashData = await hashService.verify(hash, this.confirmRegisterSecret);

            //Записываем хеш в базу, чтобы его нельзя было повторно использовать
            let savedHash = await hashService.save(hash);
            //Если хэш не сохранился, тогда не позволяем подтвердить емайл
            if (!savedHash || !savedHash.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorHashMessage)
            }

            let user_id = hashData.data.id;
            let user = await userService.getById(user_id, false);

            //Если пользователь уже активирован, выдаем ошибку
            if (user && user.id) {

                let result = await userService.update(user_id, {active: true})
                //Если по какой-то причине юзер не обновился, удаляем тогда и хэш
                if (!result || !result.id) {
                    await hashService.delete(savedHash.id);
                    throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorUpdateUserMessage)
                }

                res.send(new AppSuccess({id: user.id}, successMessage));
            }
            else {
                //Хэш не удаляем, ведь пользователь уже активен, а значит такой хеш бесполезен.
                //Пусть хранится в базе
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorAlreadyConfirmed)
            }
        }
        catch(error) {
            next(error)
        }
    }
    
    /**
     * Отправить запрос на подтверждение пароля
     * TODO send Email with HASH
     */
    @ValidationMiddleware(emailSchema, IEnumValidationTypes.body)
    @Post('/forgot_password')
    async forgot_password(@Res() res, @Body() params : IEmailData, @Next() next: NextFunction)
    {
        let resultMessage = 'Сообщение о смене пароля будет направлено на почту, если такой пользователь существует';
        let result;
        let data : IForgotPasswordResult = {};
        
        let user = await (new UsersService).getByLogin(params.email);

        if (user) {
            //Генерируем токен
            let token = JWT.generateAccessToken(
                {
                    id: user.id
                },
                JWT_TIME_CHANGE_PASSWORD_SECRET,
                this.changePasswordSecret
            );

            //TODO SEND EMAIL отправляем на почту
            let send = false;

            //Если приложение работает в режиме тестирования, отдаем в ответе хэш
            if (debug === true) {
                data.token = token;
                data.send = send;
                result = data;
            }

        }
        
        res.send(new AppSuccess(result, resultMessage))
    }

    /**
     * Восстановление пароля
     */
    @ValidationMiddleware(changePasswordSchema, IEnumValidationTypes.body)
    @Post('/change_password/:hash')
    async change_password(@Res() res, @Body() body : IPasswordData, @Params('hash') hash : string, @Next() next: NextFunction)
    {
        let successMessage = 'Password was changed';
        let errorMessage = 'Wrong hash data provided';
        let oldPasswordErrorMessage = 'Новый пароль должен отличаться отпредыдущего';

        try {
            let userService = new UsersService;
            let hashService = new HashService;

            //Парсим hash в массив
            let hashData = await hashService.verify(hash, this.changePasswordSecret);

            //Записываем хеш в базу, чтобы его нельзя было повторно использовать
            let savedHash = await hashService.save(hash);
            //Если хэш не сохранился, тогда не позволяем сменить пароль
            if (!savedHash || !savedHash.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage)
            }

            let user_id = hashData.data.id;
            let user = await userService.getById(user_id, null, ['id', 'name', 'last_name', 'email', 'group_id', 'active', 'password', 'salt']);
            let checkPassword = user.validPassword(body.password);

            if (checkPassword) {
                await hashService.delete(savedHash.id);
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, oldPasswordErrorMessage)
            }

            if (user && user.id) {
                //Обновляем пароль юзера
                let result = await userService.update(user_id, {password: body.password})

                //Если по какой-то причине пароль не удалось сменить, удаляем тогда и хэш
                if (!result || !result.id) {
                    await hashService.delete(savedHash.id);
                    throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage)
                }

                res.send(new AppSuccess({}, successMessage));
            }
            else {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage)
            }
            
        }
        catch(error) {
            next(error);
        }
    }
}