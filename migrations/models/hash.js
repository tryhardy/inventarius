import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js'

const options = {
  sequelize: db,
  timestamps: true,
  createdAt:'date_create',
  updatedAt:'date_update',
  tableName: 'hash'
};

class HashModel extends Model
{}

const HashSchema = HashModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  hash: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, options);

export {HashModel, HashSchema}