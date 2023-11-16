import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelOptions } from '../classes/model_options';
import { v4 as uuidv4 } from 'uuid';
import { ICompanyRoles } from '../interfaces/company/icompany_roles';
import { IEnumCompanyRole } from '../interfaces/enums/enum_company_role';

const options = new ModelOptions('company_roles');

class CompanyRolesModel extends Model implements ICompanyRoles
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