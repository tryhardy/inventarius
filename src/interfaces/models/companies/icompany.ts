import { IDates } from "../idates";
import { IID } from "../iid";

export interface ICompany extends IID, IDates {
    type_id: string,
    name ?: string,
    active : boolean,
    address ?: string
    creator : string,
}