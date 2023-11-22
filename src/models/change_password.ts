import { DataTypes, Model } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { IEnumUserGroups } from '../enums/enum_user_groups';
import { IChangePassword } from '../interfaces/models/ichange_password';

const options = new ModelOptions('change_password_hash');

class ChangePasswordModel extends Model implements IChangePassword
{
  id: string;
  hash: IEnumUserGroups;
  date_create: Date;
  date_update: Date;
}

const ChangePasswordSchema = ChangePasswordModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, options);

export {ChangePasswordModel, ChangePasswordSchema}