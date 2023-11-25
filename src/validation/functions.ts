import { IEnumCompanyType } from "../enums/enum_company_type";
import { ICompanyCreate } from "../interfaces/controllers/companies/icompany_create";

/**
 * Кастомные функции валидации
 * @param value 
 * @param param1 
 * @returns 
 */

//Проверка для регистрации нового пользователя с привязкой к компании
//Передаем ли мы тип компании при регистрации?
export function companyValidator(value : ICompanyCreate, helper)
{
    if (!Object(value) || !value) {
        return helper.message('Provided value is not a company object');
    }

    if (!value.type || !IEnumCompanyType[value.type]) {
        return helper.message('Company type not provided');
    }

    return true;
}