import { AppError } from "../classes/error";
import { ICompanyTypes } from "../interfaces/company/icompany_types";
import { ErrorCodes } from "../interfaces/enums/error_codes";
import { IUser, IUserCreate } from "../interfaces/user/iuser";
import { UsersModel } from "../models/users";
import { Service } from "./service";

export class UsersService extends Service
{
    model;

    constructor()
    {
        super();
        this.model = UsersModel;
    }

    async get(type = null) //: Promise<IUser>
    {
        try {
            let result = await this.model.findAll({});
            return this.getSuccess(result);
        }
        catch (error) {
            return this.getError(error);
        }
    }

    async create(params : IUserCreate)
    {
        try {
            let result = await this.model.create(params);
            return result;
        }
        catch (error) {
            return this.getError(error);
        }
    }
}