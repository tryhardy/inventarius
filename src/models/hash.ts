import { DataTypes, Model } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { IEnumUserGroups } from '../enums/enum_user_groups';
import { IHash } from '../interfaces/models/ihash';

const options = new ModelOptions('hash');

class HashModel extends Model implements IHash
{
  id: string;
  hash: IEnumUserGroups;
  date_create: Date;
  date_update: Date;
}

const HashSchema = HashModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  hash: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, options);

export {HashModel, HashSchema}