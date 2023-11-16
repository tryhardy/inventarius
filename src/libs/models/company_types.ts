import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelOptions } from '../classes/model_options';
import { v4 as uuidv4} from 'uuid';
import { ICompanyTypes } from '../interfaces/company/icompany_types';
import { IEnumCompanyType } from '../interfaces/enums/enum_company_type';

const options = new ModelOptions('company_types');

class CompanyTypesModel extends Model implements ICompanyTypes
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