import { CompanyTypesModel, CompanyTypesSchema } from './company_types';
import { UsersModel, UsersSchema } from './users';

import { DataTypes, Model } from 'sequelize';
import { ModelOptions } from '../classes/model_options';
import { v4 as uuidv4} from 'uuid';
import { ICompany } from '../interfaces/company/icompany';
import { IEnumCompanyType } from '../interfaces/enums/enum_company_type';

const options = new ModelOptions('companies');

class CompaniesModel extends Model implements ICompany
{
    type_id: IEnumCompanyType;
    name?: string;
    active: boolean;
    address?: string;
    creator: string;
    id: string;
    date_create: Date;
    date_update: Date;

}

const CompaniesSchema = CompaniesModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    }, 
    options
);

CompanyTypesSchema.hasMany(CompaniesSchema, {
    foreignKey: 'type_id',
    keyType: DataTypes.UUID
});

UsersSchema.hasMany(CompaniesSchema, {
    foreignKey: 'creator',
    keyType: DataTypes.UUID
});

export { CompaniesModel, CompaniesSchema }