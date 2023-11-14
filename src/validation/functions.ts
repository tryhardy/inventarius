import { ICompanyCreate } from "../libs/interfaces/company/icompany";
import { ICompanyWorkerCreate } from "../libs/interfaces/company/icompanyworker";
import { IEnumCompanyType } from "../libs/interfaces/enums/enum-company-type";

export function checkPassword(value, { req, location, path }) : any
{
    let params = req[location];

    if (!params.password) return false;
    if (!value) return false;
    if (params.password != value) return false;
    
    return true;
}

export function isCompanyObject(value : ICompanyCreate, { req, location, path }) : boolean
{
    if (!value) return false;
    if (!value.type) return false;
    if (!IEnumCompanyType[value.type]) return false;
    return true;
}

export function isWorkerObject(value : ICompanyWorkerCreate, { req, location, path }) : boolean
{
    if (!value) return false;
    if (!value.name) return false;
    return true;
}