import { Body, Controller, Delete, Get, Next, Params, Post, Query, Req, Res } from "@decorators/express";
import { IEnumSuccessCodes } from "../enums/success_codes";
import { AUTH_DATA_FIELD, DEFAULT_COMPANY_ROLE, JWT_INVITE_WORKER_SECRET, JWT_TIME_JWT_INVITE_WORKER_SECRET } from "../common/constants";
import { NextFunction } from 'express';
import { WorkersService } from "../services/workers_service";
import { IWorkerCreateDTO } from "../interfaces/dto/iworker_create_dto";
import { CompanyRolesService } from "../services/company_roles_service";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";
import { AppSuccess } from "../common/result/success";
import { IWorkerCreate } from "../interfaces/controllers/workers/iworker_create";
import { IWorkerUpdate } from "../interfaces/controllers/workers/iworker_update";
import { IWorkerUpdateDTO } from "../interfaces/dto/iworker_update_dto";
import { ValidationMiddleware } from "../middleware/validation";
import { workerUpdateSchema } from "../validation/schemas/worker_update_schema";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { GuardAuthMiddleware } from "../middleware/guard_auth";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import { IWorkerFilter } from "../interfaces/controllers/workers/iworker_filter";
import { IEnumCompanyRole } from "../enums/enum_company_role";
import { Roles } from "../common/roles";
import { emailSchema } from "../validation/schemas/email_schema";
import { IEmailData } from "../interfaces/controllers/auth/iemail_data";
import { UsersService } from "../services/users_service";
import { JWT } from "../common/jwt";
import { debug } from "../app";
import { HashService } from "../services/hash_service";
import { workerCreateSchema } from "../validation/schemas/worker_create_schema";
import { WorkersHelper } from "../common/helpers/workers_helper";


/**
 * Контроллер для работы с таблицей компаний
 */
@Controller('/worker')
export class WorkersController
{
    inviteWorkerSecretKey = JWT_INVITE_WORKER_SECRET;
    inviteTokenTime = JWT_TIME_JWT_INVITE_WORKER_SECRET;

    status = IEnumSuccessCodes.SUCCESS;

    constructor() {}

    //Инвайт по ссылке
    //Приглас на почту, если такого юзера нет
    //Привязка к компании, если такой юзер есть

    /**
     * Получить список сотрудников компании по фильтру
     * только для авторизованных
     * Юзер с ролью "Клиент" может получить только сотрудников в компаниях, где он овнер или админ
     */
    @GuardAuthMiddleware()
    @Get('/:company_id')
    async getByFilter(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('company_id') company_id : string, @Query() params : IWorkerFilter, @Next() next: NextFunction)
    {
        try {
            let group = auth_data.group;
            let user = auth_data.user;
            let user_id = user.id;
            let workerService = (new WorkersService);
            let isClient = Roles.isClient(group);

            if (isClient) {
                let isOwnerOrAdmin = await workerService.findOwnerOrAdmin({
                    company_id: company_id,
                    user_id: user_id
                });

                if (!isOwnerOrAdmin || !isOwnerOrAdmin['id']) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
                }
            }

            params.company_id = company_id;
            console.log(params)

            let result = await workerService.find(params);
            res.send(new AppSuccess(result))
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Получить конкретного сотрудника по ид
     * только для авторизованных
     * Юзер с ролью "Клиент" может получить только сотрудников в своих компаниях
     */
    @GuardAuthMiddleware()
    @Get('/:company_id/:worker_id')
    async getById(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('company_id') company_id : string, @Params('worker_id') worker_id : string, @Next() next: NextFunction)
    {
        try {
            let workerNotFoundMessage = 'Worker not found';
            let group = auth_data.group;
            let user = auth_data.user;
            let user_id = user.id;
            let workerService = (new WorkersService);
            let isClient = Roles.isClient(group);

            if (isClient) {
                let isOwnerOrAdmin = await workerService.findOwnerOrAdmin({
                    company_id: company_id,
                    user_id: user_id
                });

                if (!isOwnerOrAdmin || !isOwnerOrAdmin['id']) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
                }
            }

            let service = new WorkersService;
            let worker = await service.getById(worker_id, company_id);

            if (!worker || !worker.id) {
                throw new AppError(IEnumErrorCodes.NOT_FOUND, workerNotFoundMessage)
            }

            res.send(new AppSuccess(worker))
        }
        catch(error) {
            next(error)
        }
    }

    /**
     * Создать сотрудника
     * только для авторизованных
     * Юзер с ролью "Клиент" может создать сотрудника только в своей компании, где является овнером или админом
     */
    @GuardAuthMiddleware()
    @ValidationMiddleware(workerCreateSchema, IEnumValidationTypes.body)
    @Post('/create/:company_id')
    async create(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('company_id') company_id : string, @Body() params : IWorkerCreate, @Next() next: NextFunction)
    {
        let errorNotFoundCmpanyMessage = 'Company role not found';
        let errorWorkerMessage = 'Worker was not created';
        let successMessage = 'Worker created';

        try {
            let group = auth_data.group;
            let user = auth_data.user;
            let user_id = user.id;
            let workerService = (new WorkersService);

            //Не разрешаем создать сотрудника в чужой компании
            if (group === IEnumUserGroups.client) {
                let isOwnerOrAdmin = await workerService.findOwnerOrAdmin({
                    company_id: company_id,
                    user_id: user_id
                });

                if (!isOwnerOrAdmin || !isOwnerOrAdmin['id']) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
                }
            }
    
            //Ищем роль по коду
            let roleCode = params.role ?? DEFAULT_COMPANY_ROLE;
            let roleResult = await (new CompanyRolesService).getByCode(roleCode);
            if (!roleResult || !roleResult.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorNotFoundCmpanyMessage);
            }
    
            let workerDTO : IWorkerCreateDTO = {
                name : params.name,
                last_name : params.last_name,
                post : params.post,
                active : true,
                company_id: company_id, 
                user_id : null,
                role_id : roleResult.id,
                is_owner: false
            }
            //TODO генерируем ссылку инвайт, если в параметрах передается почта
            let worker = await (new WorkersService).create(workerDTO);

            if (!worker || !worker.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorWorkerMessage);
            }

            //Если передается емайл - генерируем ссылку-приглашение
            let result;
            let token;
            if (params.email) {
                token = WorkersHelper.invite(params.email, company_id, worker.id);
            }

            result.company_id = company_id;
            result.worker = worker;

            if (token) {
                result.invite_token = token;
            }

            res.send(new AppSuccess(result, successMessage));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Изменить сотрудника
     * только для авторизованных
     * Юзер с группой "Клиент" может изменить сотрудника только в своей компании (где он овнер или хотя бы админ).
     * Юзер с группой "Клиент" не может изменить роль овнера компании, и активность овнера компании
     * Юзер с группой клиент не может изменить user_id сотрудника (только выслать инвайт)
     */
    @GuardAuthMiddleware()
    @ValidationMiddleware(workerUpdateSchema, IEnumValidationTypes.body)
    @Post('/:company_id/:worker_id')
    async update(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Body() params : IWorkerUpdate, @Params('company_id') company_id : string, @Params('worker_id') worker_id : string, @Next() next: NextFunction)
    {
        try {
            let errorNotFoundCmpanyMessage = 'Company role not found';
            let errorNotFoundWorker = 'Worker not found';
            let successMessage = 'Worker updated';

            let group = auth_data.group;
            let user = auth_data.user;
            let user_id = user.id;
            let workerService = (new WorkersService);
            let isClient = Roles.isClient(group);

            if (isClient) {
                let isOwnerOrAdmin = await workerService.findOwnerOrAdmin({
                    company_id: company_id,
                    user_id: user_id
                });

                if (!isOwnerOrAdmin || !isOwnerOrAdmin['id']) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
                }
            }

            //Если в запросе передается роль, ищем роль по символьному коду
            let role_id;
            if (params.role) {
                let rolesService = new CompanyRolesService;
                let roleResult = await rolesService.getByCode(params.role);

                if (!roleResult || !roleResult.id) {
                    throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorNotFoundCmpanyMessage);
                }

                role_id = roleResult.id;
            }

            //Проверяем, есть ли такой работник в БД
            let findWorker = await workerService.findOne({
                id: worker_id,
                company_id: company_id
            });

            //Если работник не найден, выводим ошибку
            if (!findWorker || !findWorker['id']) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorNotFoundWorker);
            }

            //Если клиент пытается изменить овнера
            if (findWorker.is_owner == true) {
                //Если клиент пытается изменить роль овнера, не даем ему это сделать
                if (params.role && params.role != IEnumCompanyRole.admin) {
                    throw new AppError(IEnumErrorCodes.BAD_REQUEST, 'You can\'t change owners role');
                }

                //Если клиент пытается изменить активность овнера, не даем ему это сделать
                if (params.active || typeof params.active === 'boolean') {
                    throw new AppError(IEnumErrorCodes.BAD_REQUEST, 'You can\'t change owners activity');
                }
            }

            let updateDTO : IWorkerUpdateDTO = {}
            if (params.name) updateDTO.name = params.name;
            if (params.last_name) updateDTO.last_name = params.last_name;
            if (params.post) updateDTO.post = params.post;
            if (typeof params.active === 'boolean') updateDTO.active = params.active;
            if (role_id) updateDTO.role_id = role_id;
  
            //TODO что делать, если меняем имя/фамилию работника? По идее имя пользователя меняться не должно
            let worker = await workerService.update(worker_id, updateDTO);
            res.send(new AppSuccess(worker, successMessage));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Удалить сотрудника
     * только для авторизованных
     * Юзер с группой "Клиент" может удалить сотрудника только в своей компании (или где он админ)
     * Юзер с группой "Клиент" не может удалить овнера компании
     */
    @GuardAuthMiddleware()
    @Delete('/:company_id/:worker_id')
    async delete(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('company_id') company_id : string, @Params('worker_id') worker_id : string, @Next() next: NextFunction)
    {
        let deleteOwnerErrorMessage = 'You can\'t delete owner of this company';

        try {
            let group = auth_data.group;
            let user = auth_data.user;
            let user_id = user.id;
            let workerService = (new WorkersService);
            let isClient = Roles.isClient(group);

            //Если пользователь с ролью "Клиент" не позволяем ему удалить сотрудника в чужой компании
            //Только если у этого пользователя внутри компании установлена роль "admin", или он является создателем компании
            if (isClient) {
                let isOwnerOrAdmin = await workerService.findOwnerOrAdmin({
                    company_id: company_id,
                    user_id: user_id
                });

                if (!isOwnerOrAdmin || !isOwnerOrAdmin['id']) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
                }
            }

            //Нельзя удалить владельца компании
            let checkOwner = await workerService.findOne({
                id: worker_id,
                company_id: company_id,
                is_owner: true
            });

            if (checkOwner && checkOwner.id) {
                throw new AppError(IEnumErrorCodes.PERMISSION_DENIED, deleteOwnerErrorMessage)
            }

            let serviceResult = await workerService.delete(worker_id);

            res.send(new AppSuccess({
                status: serviceResult
            }));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Принять приглашение на добавление в компанию (для уже существующего пользователя)
     * Только для авторизованных
     * Нужно быть авторизованным под тем пользователем, которого приглашают в компанию
     * Хеш можно использовать только один раз
     * 
     * @param res 
     * @param params 
     * @param company_id 
     * @param worker_id 
     * @param next 
     */
    @GuardAuthMiddleware()
    @Post('/invite/confirm/:hash')
    async confirmInvite(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Params('hash') hash : string, @Next() next: NextFunction) 
    {
        try{
            let errorMessage = 'Wrong hash data provided';
            let workerNotFoundMessage = 'Worker not found or has been already invited';

            let workerService = new WorkersService;
            let hashService = new HashService;
            let user = auth_data.user;
            let user_id = user.id;

            //Парсим hash в массив
            let data = await hashService.verify(hash, this.inviteWorkerSecretKey);

            if (!data) {
                throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
            }

            //Если пользователь из инвайта и авторизованный пользователь не совпадают
            if (user_id !== data.data.user_id) {
                throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
            }
        
            //Проверяем, есть ли такой работник в базе
            let worker = await workerService.findOne({id: data.data.worker_id, user_id: null, active: true})
            if (!worker || !worker.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, workerNotFoundMessage)
            }

            //Записываем хеш в базу, чтобы его нельзя было повторно использовать
            let savedHash = await hashService.save(hash);
            //Если хэш не сохранился, тогда не позволяем сменить пароль
            if (!savedHash || !savedHash.id) {
                throw new AppError(IEnumErrorCodes.BAD_REQUEST, errorMessage)
            }

            await worker.update({user_id: user_id});

            res.send(new AppSuccess(worker));
        }
        catch(error) {
            next(error);
        }
    }

    /**
     * Инвайт на приглашение пользователя в компанию
     * Проверяет, есть ли уже на сайте пользователь с такой почтой, и если есть, генерирует ссылку-приглашение БЕЗ регистрации нового пользователя
     * Метод доступен только авторизованным пользователям
     * Отправить инвайт могут пользователи с ролью в компании "admin" или овнеры компании.
     * 
     * @param res 
     * @param params 
     * @param company_id 
     * @param worker_id 
     * @param next 
     */
    @GuardAuthMiddleware()
    @ValidationMiddleware(emailSchema, IEnumValidationTypes.body)
    @Post('/invite/:company_id/:worker_id')
    async invite(@Res() res, @Req(AUTH_DATA_FIELD) auth_data, @Body() params : IEmailData, @Params('company_id') company_id : string, @Params('worker_id') worker_id : string, @Next() next: NextFunction) 
    {
        try {
            let group = auth_data.group;
            let user = auth_data.user;
            let user_id = user.id;
            let isClient = Roles.isClient(group);
            let workerService = (new WorkersService);

            //Если пользователь с ролью "Клиент" не позволяем ему выслать инвайт
            //Только если у этого пользователя внутри компании установлена роль "admin", или он является создателем компании
            let isOwnerOrAdmin;
            if (isClient) {
                isOwnerOrAdmin = await workerService.findOwnerOrAdmin({
                    company_id: company_id,
                    user_id: user_id
                });

                if (!isOwnerOrAdmin || !isOwnerOrAdmin['id']) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED)
                }
            }

            let token = WorkersHelper.invite(params.email, company_id, worker_id);
            let result;

            if (token) {
                result = {
                    invite_token: token
                }
            }

            //TODO SEND EMAIL отправлять сгенерированную ссылку с хэшом на емайл пользователю
            res.send(new AppSuccess(result, 'Invite was sended'));

        }
        catch(error) {
            next(error)
        }
    }
}