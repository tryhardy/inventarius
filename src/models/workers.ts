import { CompanyTypesModel, CompanyTypesSchema } from './company_types';
import { UsersModel, UsersSchema } from './users';

import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4} from 'uuid';
import { CompaniesSchema } from './companies';
import { CompanyRolesSchema } from './company_roles';
import { ModelOptions } from '../common/options/model_options';
import { IWorker } from '../interfaces/models/iworker';

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
            defaultValue: DataTypes.UUIDV4,
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

UsersSchema.hasMany(WorkersSchema, {
    as: 'worker',
    foreignKey: 'user_id',
});
WorkersSchema.belongsTo(UsersSchema, {
    foreignKey: 'user_id',
    keyType: DataTypes.UUID,
    as: 'user',
});

CompaniesSchema.hasMany(WorkersSchema, {
    as: 'worker',
    foreignKey: 'company_id',
});
WorkersSchema.belongsTo(CompaniesSchema, {
    foreignKey: 'company_id',
    keyType: DataTypes.UUID,
    as: 'company',
});

CompanyRolesSchema.hasMany(WorkersSchema, {
    as: 'worker',
    foreignKey: 'role_id',
});
WorkersSchema.belongsTo(CompanyRolesSchema, {
    foreignKey: 'role_id',
    keyType: DataTypes.UUID,
    as: 'role',
})

export { WorkersModel, WorkersSchema }