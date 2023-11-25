import { IEnumUserGroups } from "../enums/enum_user_groups";

export class Roles 
{
    static isClient(role)
    {
        if (role === IEnumUserGroups.client) {
            return true;
        }

        return false;
    }
}