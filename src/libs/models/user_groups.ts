import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelOptions } from '../classes/model_options';
import { v4 as uuidv4} from 'uuid';
import { IUserGroups } from '../interfaces/user/iuser';
import { IEnumUserGroups } from '../interfaces/enums/enum_user_groups';

const options = new ModelOptions('user_groups');

class UserGroupsModel extends Model implements IUserGroups
{
  date_create: Date;
  date_update: Date;
  code: IEnumUserGroups;
  id: string;
}

const UserGroupsSchema = UserGroupsModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4(),
    primaryKey: true,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, options);

export {UserGroupsModel, UserGroupsSchema}