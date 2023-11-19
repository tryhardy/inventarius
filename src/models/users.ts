import { DataTypes, Model } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { UserGroupsModel, UserGroupsSchema } from './user_groups';
import { v4 as uuidv4} from 'uuid';
import { IEnumUserGroups } from '../enums/enum_user_groups';
import { IUser } from '../interfaces/models/users/iuser';

const options = new ModelOptions('users');

class UsersModel extends Model implements IUser
{
    group_id: IEnumUserGroups;
    id: string;
    name: string;
    last_name: string;
    email: string;
    password: string;
    date_create: Date;
    date_update: Date;
    code: IEnumUserGroups;
}

const UsersSchema = UsersModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date_login: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date()
        },
    }, 
    options
);

UserGroupsSchema.hasMany(UsersSchema, {
    foreignKey: 'group_id',
    keyType: DataTypes.UUID,
});

export { UsersSchema, UsersModel }