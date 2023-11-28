import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../config/db.js'

const options = {
    sequelize: db,
    timestamps: true,
    createdAt:'date_create',
    updatedAt:'date_update',
    tableName: 'user_groups'
};

class UserGroupsModel extends Model
{}

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