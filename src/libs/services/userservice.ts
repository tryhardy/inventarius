import { AppError } from "../classes/error";
import { ICompanyTypes } from "../interfaces/company/icompanytypes";
import { ErrorCodes } from "../interfaces/enums/error-codes";
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