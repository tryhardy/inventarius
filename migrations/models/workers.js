import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';
import { CompaniesSchema } from './companies.js';
import { UsersSchema } from './users.js';
import { CompanyRolesSchema } from './company_roles.js';

const table = 'workers';

const options = {
  sequelize: db,
  timestamps: true,
  createdAt:'date_create',
  updatedAt:'date_update',
  tableName: table
};

class WorkersModel extends Model
{}

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