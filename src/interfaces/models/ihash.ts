import { IDates } from "./idates";
import { IID } from "./iid";

export interface IHash extends IID, IDates {
    hash: string
}