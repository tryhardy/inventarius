import { DataTypes } from 'sequelize';
import db from '../../db';
import { PGModelOptions } from '../../options/pg-model-option';

const CompanyTypesSchema = {
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

export const CompanyTypesModel = db.define(
  'company_types',
  CompanyTypesSchema,
  PGModelOptions
)

module.exports.CompanyTypesModel = CompanyTypesModel