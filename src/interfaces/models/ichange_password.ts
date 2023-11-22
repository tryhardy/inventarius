import { IDates } from "./idates";
import { IID } from "./iid";

export interface IChangePassword extends IID, IDates {
    hash: string
}