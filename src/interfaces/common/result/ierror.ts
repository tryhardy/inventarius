import { IEnumStatuses } from "../../../enums/enum_statuses"

export interface IError {
    status: IEnumStatuses.ERROR
    code : number
    data ?: any,
    message ?: string,
    date: string
}