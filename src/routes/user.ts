import express from 'express';
import { ISuccess } from '../libs/interfaces/answers/isuccess';
import { UserValidationSimple } from '../validation/usercreate';
import { AppError } from '../libs/classes/error';
import { ErrorCodes } from '../libs/interfaces/enums/error-codes';
import { Validation } from '../libs/classes/validation';
import { IUserCreateBase } from '../libs/interfaces/user/iuser';
import { CompanyTypesService } from '../libs/services/companytypesservice';
import { UsersService } from '../libs/services/userservice';

const router = express.Router();

let status = 200;
let result : ISuccess = {
    status: 'SUCCESS',
    code: status,
    data: {
        access_token: 'Some token for use'
    },
    date: (new Date()).toString()
}

/**
 * Получить список пользователей
 */
router.get('/user', async (req, res, next) => {

    //const result = await Users.findAll({})

    res.status(status);
    res.send(result);
});

/**
 * Создать нового пользователя
 */
router.post('/user/create', UserValidationSimple, async (req, res, next) => {

    //Валидация входящих параметров
    const errors = new Validation(req).getErrors();
    if (errors) {
        let error = new AppError(ErrorCodes.VALIDATION_ERROR, 'Validation error', errors)
        res.status(ErrorCodes.VALIDATION_ERROR);
        next(error);
    }
    
    //Проверяем, существует ли в БД указанный тип компании
    let params : IUserCreateBase = req.body;
    let companyTypeService = new CompanyTypesService();
    let companyType = await companyTypeService.get(params['company'].type);

    if (!companyType) {
        let error = new AppError(
            ErrorCodes.BAD_REQUEST, 
            '', 
            {
                error: "Тип компании не найден"
            }
        )
        res.status(ErrorCodes.BAD_REQUEST);
        next(error);
    }

    //Создаем пользователя
    const userService = new UsersService;
    const result = await userService.create(params);

    if (result.status === 'ERROR') {
        res.status(result.code);
        next(result);
    }

    res.status(200);
    res.send(result);
});

/**
 * Создать нового пользователя
 */
router.post('/user/create/:hash', (req, res, next) => {
    res.status(status);
    res.send(result);
});

/**
 * Создать нового пользователя по ссылке-приглашению
 */
router.post('/user/create/:hash', (req, res, next) => {
    res.status(status);
    res.send(result);
});

/**
 * Изменить пользователя
 */
router.post('/user/:id', (req, res, next) => {
    res.status(status);
    res.send(result);
});

/**
 * Удалить пользователя
 */
router.delete('/user/:id', (req, res, next) => {
    res.status(status);
    res.send(result);
});

export default router;