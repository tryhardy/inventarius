import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';
import { CompanyTypesSchema } from './company_types.js';
import { UsersSchema } from './users.js';

const table = 'companies';

const options = {
  sequelize: db,
  timestamps: true,
  createdAt:'date_create',
  updatedAt:'date_update',
  tableName: table
};

class CompaniesModel extends Model
{
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

//Связка с типами компаний
CompanyTypesSchema.hasMany(CompaniesSchema, {
    foreignKey: 'type_id',
    keyType: DataTypes.UUID,
    as: 'type'
});
CompaniesSchema.belongsTo(CompanyTypesSchema, {
    foreignKey: 'type_id',
    keyType: DataTypes.UUID,
    as: 'type'
});
 
//Связка с пользователями - овнерами
UsersSchema.hasMany(CompaniesSchema, {
    foreignKey: 'creator_id',
    keyType: DataTypes.UUID,
    as: 'creator'
});
CompaniesSchema.belongsTo(UsersSchema, {
    foreignKey: 'creator_id',
    keyType: DataTypes.UUID,
    as: 'creator'
});

export { CompaniesModel, CompaniesSchema }