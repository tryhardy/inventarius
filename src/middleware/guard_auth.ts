import { attachMiddleware } from "@decorators/express"
import { NextFunction } from 'express';
import { JWT } from "../interfaces/common/jwt";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import { AUTH_DATA_FIELD } from "../common/constants";

/**
 * Проверяет, авторизован ли пользователь, а также принадлежит ли он к нужной группе ролей
 * @param needAuth 
 * @returns 
 */
export function GuardAuthMiddleware(needAuth : boolean = true, perms: Array<IEnumUserGroups> = []) 
{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) 
    {
        attachMiddleware(target, propertyKey, (req : Request, res : Response, next : NextFunction) => 
        {
            try {
                let token = JWT.extractToken(req);
                let data;

                if (token) {
                    data = JWT.verify(token);

                    if (!data && needAuth) {
                        throw new Error('JWT verify failed!');
                    }
                }

                // Если требуется авторизация, но не передан токен или передан неверный токен,
                // Возвращаем ошибку
                if (needAuth && (!token || !data)) {
                    throw new Error('Permission denied');
                }

                // Если требуется проверка системных ролей 
                // (например доступ к методу может получить только администратор системы или только менеджер)
                if (perms.length > 0 && data) {
                    let user = data.data;
                    let check = false;
                    perms.forEach((value, index) => {
                        if (value === user.group) {
                            check = true;
                        }
                    })

                    //Админам можно ВСЕ, хехе
                    if (user.group === IEnumUserGroups.admin) {
                        check = true;
                    }

                    if (!check) {
                        throw new Error('Permission denied');
                    }

                }
                else if (perms.length > 0 && !data) {
                    throw new Error('Permission denied');
                }

                // Записываем данные в реквест, чтобы в роутах
                // иметь к ним доступ
                req[AUTH_DATA_FIELD] = {
                    authorized : data ? true : false,
                    user: data ? data.data : {},
                    group: data ? data.data.group : ''
                }

                next();
            }
            catch(error) {
                next(error)
            }
        })
    }
}