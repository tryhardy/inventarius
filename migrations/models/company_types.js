import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js'

const table = 'company_types';

const options = {
  sequelize: db,
  timestamps: true,
  createdAt:'date_create',
  updatedAt:'date_update',
  tableName: table
};

class CompanyTypesModel extends Model
{}

const CompanyTypesSchema = CompanyTypesModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, 
  options
);

export { CompanyTypesModel, CompanyTypesSchema}