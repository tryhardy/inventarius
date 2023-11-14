import { DataTypes } from 'sequelize';
import db from '../../db';
import { PGModelOptions } from '../../options/pg-model-option';

const CompanyRolesSchema = {
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

export const CompanyRolesModel = db.define(
  'company_roles',
  CompanyRolesSchema,
  PGModelOptions
)

module.exports.CompanyRolesModel = CompanyRolesModel