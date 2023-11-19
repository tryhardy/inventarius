import express from 'express';

import { ISuccess } from '../interfaces/common/result/isuccess';

import { UserValidationSimple } from '../validation/usercreate';

import { UsersService } from '../services/users_service';
import { IEnumStatuses } from '../enums/enum_statuses';

const router = express.Router();
const usersService = new UsersService();

let status = 200;
let result : ISuccess = {
    status: IEnumStatuses.SUCCESS,
    code: status,
    data: {
        access_token: 'Some token for use'
    },
    date: (new Date()).toString()
}


router.post('/user/create', UserValidationSimple, async (req, res, next) => {   
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