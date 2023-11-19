import { IEnumStatuses } from "../../../enums/enum_statuses";

export interface ISuccess {
    status: IEnumStatuses.SUCCESS,
    code: number,
    data: any,
    date: string,
    message ?: string
}