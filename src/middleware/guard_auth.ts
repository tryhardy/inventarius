import { attachMiddleware } from "@decorators/express"
import { NextFunction } from 'express';
import { JWT } from "../common/jwt";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import { AUTH_DATA_FIELD } from "../common/constants";
import { RequestAuthData } from "../interfaces/middleware/request_auth_data";
import { IEnumErrorCodes } from "../enums/error_codes";
import { AppError } from "../common/result/error";

/**
 * Проверяет, авторизован ли пользователь, а также принадлежит ли он к указанной группе ролей
 * Если вызвать @GuardAuthMiddleware(false) - то
 * @param needAuth 
 * @returns 
 */
export function GuardAuthMiddleware(perms: Array<IEnumUserGroups> = []) 
{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) 
    {
        attachMiddleware(target, propertyKey, (req : Request, res : Response, next : NextFunction) => 
        {
            let data : RequestAuthData = req[AUTH_DATA_FIELD];

            if (!data) {
                data = JWT.getAuthDataFromHeaders(req);
            }

            try {
                // Если требуется авторизация, но не передан токен или передан неверный токен,
                // Возвращаем ошибку
                if (!data || !data.authorized) {
                    throw new AppError(IEnumErrorCodes.PERMISSION_DENIED);
                }

                // Если требуется проверка системных ролей 
                // (например доступ к методу может получить только администратор системы или только менеджер)
                if (perms.length > 0 && data) {
                    let user = data.user;
                    let check = false;
                    perms.forEach((value, index) => {
                        if (value === data.group) {
                            check = true;
                        }
                    })

                    //Админам можно ВСЕ, хехе
                    if (data.group === IEnumUserGroups.admin) {
                        check = true;
                    }

                    if (!check) {
                        throw new AppError(IEnumErrorCodes.PERMISSION_DENIED);
                    }

                }

                next();
            }
            catch(error) {
                next(error)
            }
        })
    }
}