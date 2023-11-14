import { Sequelize } from 'sequelize';
import 'dotenv/config';

export default new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000
  }
})