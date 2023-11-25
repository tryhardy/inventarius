import { UserGroupsModel, UserGroupsSchema } from "../models/user_groups";
import { Service } from "./service";

export class UserGroupsService extends Service<UserGroupsModel>
{
    constructor()
    {
        super(UserGroupsSchema);
    }

    async getByCode(type) : Promise<UserGroupsModel>
    {
        let query = {
            where: {
                code: type
            }
        };

        let result = await this.model.findOne(query);

        return result;
    }    
}