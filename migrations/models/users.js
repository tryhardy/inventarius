import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js'
import { UserGroupsSchema } from './user_groups.js';

const options = {
    sequelize: db,
    timestamps: true,
    createdAt:'date_create',
    updatedAt:'date_update',
    tableName: 'users'
};

class UsersModel extends Model
{
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
            allowNull: true,
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
UserGroupsSchema.hasMany(UsersSchema, {
    foreignKey: 'group_id',
    as: 'group'
});
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