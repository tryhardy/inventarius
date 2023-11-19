import { CompanyTypesModel, CompanyTypesSchema } from './company_types';
import { UsersModel, UsersSchema } from './users';

import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4} from 'uuid';
import { CompaniesSchema } from './companies';
import { CompanyRolesSchema } from './company_roles';
import { ModelOptions } from '../common/options/model_options';
import { IWorker } from '../interfaces/models/workers/iworker';

const options = new ModelOptions('workers');

class WorkersModel extends Model implements IWorker
{
    is_owner: boolean;
    id: string;
    name: string;
    last_name?: string;
    post?: string;
    active: boolean;
    company_id: string;
    user_id?: string;
    role_id?: string;
    date_create: Date;
    date_update: Date;
}

const WorkersSchema = WorkersModel.init(
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
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_owner: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, 
    options
);

CompaniesSchema.hasMany(WorkersSchema, {
    foreignKey: 'company_id',
    keyType: DataTypes.UUID
});

UsersSchema.hasMany(WorkersSchema, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID
});

CompanyRolesSchema.hasMany(WorkersSchema, {
    foreignKey: 'role_id',
    keyType: DataTypes.UUID
});

export { WorkersModel, WorkersSchema }