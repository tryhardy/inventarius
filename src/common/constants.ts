import { IEnumCompanyRole } from "../enums/enum_company_role";
import { IEnumCompanyType } from "../enums/enum_company_type";
import { IEnumUserGroups } from "../enums/enum_user_groups";
import 'dotenv'

export const CREATOR_COMPANY_ROLE = IEnumCompanyRole.admin;
export const DEFAULT_COMPANY_ROLE = IEnumCompanyRole.worker;

export const DEFAULT_COMPANY_TYPE = IEnumCompanyType.company;
//При регистрации по умолчанию присваиваем юзеру тип client
export const DEFAULT_USER_GROUP = IEnumUserGroups.client;

/** 
 * Название поля Request, в которое пишутся авторизационные данные 
 * Содержит данные о юзере, как и переменная $USER в битре
*/
export const AUTH_DATA_FIELD = 'auth_data';

//СЕКРЕТНЫЕ КЛЮЧИ
export const JWT_INVITE_WORKER_SECRET = process.env.JWT_INVITE_WORKER_SECRET;
export const JWT_TIME_JWT_INVITE_WORKER_SECRET = Number(process.env.JWT_TIME_JWT_INVITE_WORKER_SECRET);

export const JWT_CHANGE_PASSWORD_SECRET = process.env.JWT_CHANGE_PASSWORD_SECRET;
export const JWT_TIME_CHANGE_PASSWORD_SECRET = Number(process.env.JWT_TIME_CHANGE_PASSWORD_SECRET);

export const JWT_CONFIRM_EMAIL_SECRET = process.env.JWT_CONFIRM_EMAIL_SECRET;
export const JWT_TIME_CONFIRM_EMAIL_SECRET = Number(process.env.JWT_TIME_CHANGE_PASSWORD_SECRET);