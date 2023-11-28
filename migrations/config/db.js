import data from './config.js';
import {Sequelize} from "sequelize";

const env = process.env.NODE_ENV || 'development';
const config = data[env];

const db = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});

export default db;