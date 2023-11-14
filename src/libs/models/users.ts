import { DataTypes } from 'sequelize';
import db from '../../db';
import { PGModelOptions } from '../../options/pg-model-option';

const UserSchema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 256
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 256
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 256
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 256
    },
    active: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    group_id: {
        type: DataTypes.UUID,
        allowNull: true,
        default: null
    },
    date_login: {
        type: DataTypes.DATE,
        allowNull: true,
        default: DataTypes.NOW
    }
}

export const UsersModel = db.define(
    'users',
    UserSchema,
    PGModelOptions
)

module.exports.UsersModel = UsersModel