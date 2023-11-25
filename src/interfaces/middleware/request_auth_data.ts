import { IEnumUserGroups } from "../../enums/enum_user_groups";
import { IUserDataForAuth } from "../controllers/auth/iuser_data_for_auth";

export interface RequestAuthData {
    authorized: boolean,
    user: IUserDataForAuth,
    group: IEnumUserGroups
}