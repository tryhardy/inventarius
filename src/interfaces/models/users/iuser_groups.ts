import { IEnumUserGroups } from "../../../enums/enum_user_groups";
import { IDates } from "../idates";
import { IID } from "../iid";

// Группы пользователей
export interface IUserGroups extends IID, IDates {
    code: IEnumUserGroups,
}