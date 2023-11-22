import { IEnumCompanyRole } from "../enums/enum_company_role";
import { IEnumCompanyType } from "../enums/enum_company_type";
import { IEnumUserGroups } from "../enums/enum_user_groups";

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