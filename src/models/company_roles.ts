import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { v4 as uuidv4 } from 'uuid';
import { IEnumCompanyRole } from '../enums/enum_company_role';
import { IWorkerRoles } from '../interfaces/models/workers/worker_roles';

const options = new ModelOptions('company_roles');

class CompanyRolesModel extends Model implements IWorkerRoles
{
  date_create: Date;
  date_update: Date;
  code: IEnumCompanyRole;
  id: string;
}

const CompanyRolesSchema = CompanyRolesModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
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