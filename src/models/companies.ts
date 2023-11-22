import { CompanyTypesSchema } from './company_types';
import { UsersSchema } from './users';

import { DataTypes, Model } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { v4 as uuidv4} from 'uuid';
import { ICompany } from '../interfaces/models/companies/icompany';

const options = new ModelOptions('companies');

class CompaniesModel extends Model implements ICompany
{
    type_id: string;
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
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
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