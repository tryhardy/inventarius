import { IDates } from "../idates";
import { IID } from "../iid";

export interface IUser extends IID, IDates {
    name: string,
    last_name : string,
    email: string,
    password: string,
    group_id: string
}