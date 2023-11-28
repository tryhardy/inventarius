import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

const table = 'company_roles';
const options = {
  sequelize: db,
  timestamps: true,
  createdAt:'date_create',
  updatedAt:'date_update',
  tableName: table
};

class CompanyRolesModel extends Model
{
}

const CompanyRolesSchema = CompanyRolesModel.init({
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

export { CompanyRolesModel, CompanyRolesSchema }