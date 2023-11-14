import { DataTypes } from 'sequelize';
import db from '../../db';
import { PGModelOptions } from '../../options/pg-model-option';

const CompanySchema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 256
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 256
    },
    active: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    creator: {
        type: DataTypes.UUID,
        allowNull: true,
        default: null
    },
    date_login: {
        type: DataTypes.DATE,
        allowNull: true,
        default: DataTypes.NOW
    }
}

export const CompaniesModel = db.define(
    'companies',
    CompanySchema,
    PGModelOptions
)

module.exports.CompaniesModel = CompaniesModel