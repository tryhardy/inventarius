import { IEnumCompanyType } from "../enums/enum_company_type";
import { ICompanyCreate } from "../interfaces/models/companies/icompany_create";
import { IWorkerCreate } from "../interfaces/models/workers/iworker_create";

/**
 * Кастомные функции валидации
 * @param value 
 * @param param1 
 * @returns 
 */

//Совпадает ли поле password c check_password?
export function checkPassword(value, { req, location, path }) : any
{
    let params = req[location];

    if (!params.password) return false;
    if (!value) return false;
    if (params.password != value) return false;
    
    return true;
}

//Проверка для регистрации нового пользователя с привязкой к компании
//Передаем ли мы тип компании при регистрации?
export function isCompanyObject(value : ICompanyCreate, { req, location, path }) : boolean
{
    if (!value) return false;
    if (!value.type) return false;
    if (!IEnumCompanyType[value.type]) return false;
    return true;
}

//Проверка для регистрации нового пользователя по приглашению
//Передаем ли мы данные о работнике при регистрации?
export function isWorkerObject(value : IWorkerCreate, { req, location, path }) : boolean
{
    if (!value) return false;
    if (!value.name) return false;
    return true;
}