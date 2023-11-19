import { IEnumCompanyRole } from "../enums/enum_company_role";
import { IEnumCompanyType } from "../enums/enum_company_type";
import { IEnumUserGroups } from "../enums/enum_user_groups";

export const CREATOR_COMPANY_ROLE = IEnumCompanyRole.admin;
export const DEFAULT_COMPANY_ROLE = IEnumCompanyRole.worker;

export const CREATOR_COMPANY_TYPE = IEnumCompanyType.company;

export const DEFAULT_USER_GROUP = IEnumUserGroups.client;