import { DataTypes } from 'sequelize';
import db from '../../db';
import { PGModelOptions } from '../../options/pg-model-option';

const UserGroupsSchema = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    length: 256
  },
}

export const UserGroupsModel = db.define(
  'user_groups',
  UserGroupsSchema,
  PGModelOptions
)

module.exports.UserGroupsModel = UserGroupsModel