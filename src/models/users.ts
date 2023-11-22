import { DataTypes, Model } from 'sequelize';
import { ModelOptions } from '../common/options/model_options';
import { UserGroupsSchema } from './user_groups';
import { v4 as uuidv4} from 'uuid';
import { IEnumUserGroups } from '../enums/enum_user_groups';
import { IUser } from '../interfaces/models/users/iuser';
import crypto from 'crypto';

const options = new ModelOptions('users');

class UsersModel extends Model implements IUser
{
    group_id: IEnumUserGroups;
    id: string;
    name: string;
    last_name: string;
    email: string;
    password: string;
    date_create: Date;
    date_update: Date;
    code: IEnumUserGroups;
    salt : string

    /**
     * Проверяем пару логин-пароль
     * @param password 
     * @returns 
     */
    validPassword(password) {
        var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
        return this.password === hash; 
    }

    /**
     * Генерим пароль на основе соли
     * @param password 
     * @returns 
     */
    createPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        return crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);  
    }
}

const UsersSchema = UsersModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date_login: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date()
        },
        salt: {
            type: DataTypes.STRING,
            // allowNull: false,
        }
    }, 
    options
);

//Связка с группами пользователей
UserGroupsSchema.hasMany(UsersSchema, {});
UsersSchema.belongsTo(UserGroupsSchema, {
    foreignKey: 'group_id',
    keyType: DataTypes.UUID,
    as: 'group'
});

/**
 * Перед созданием нового юзера 
 * хэшируем пароль по уникальной соли
 */
UsersSchema.beforeCreate(function (model) 
{
    model.password = model.createPassword(model.password);  
});

/**
 * Перед изменением юзера, если меняется пароль, 
 * хэшируем пароль по уникальной соли
 */
UsersSchema.beforeUpdate(function (model)
{
    if (model.changed('password')) {
        model.password = model.createPassword(model.password);
    }
})

export { UsersSchema, UsersModel }