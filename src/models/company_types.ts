import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { v4 as uuidv4} from 'uuid';
import { IEnumCompanyType } from '../enums/enum_company_type';
import { ICompanyType } from '../interfaces/models/companies/icompany_type';

const options = new ModelOptions('company_types');

class CompanyTypesModel extends Model implements ICompanyType
{
  date_create: Date;
  date_update: Date;
  code: IEnumCompanyType;
  id: string;
}

const CompanyTypesSchema = CompanyTypesModel.init({
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

export { CompanyTypesModel, CompanyTypesSchema}