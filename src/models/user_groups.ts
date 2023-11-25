import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { v4 as uuidv4} from 'uuid';
import { IEnumUserGroups } from '../enums/enum_user_groups';
import { IUserGroups } from '../interfaces/models/iuser_groups';

const options = new ModelOptions('user_groups');

class UserGroupsModel extends Model implements IUserGroups
{
  id: string;
  code: IEnumUserGroups;
  date_create: Date;
  date_update: Date;
}

const UserGroupsSchema = UserGroupsModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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