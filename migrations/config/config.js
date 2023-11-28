import dotenv from 'dotenv';
import {} from 'dotenv/config'
dotenv.config({path: '../.env'});

const env = process.env.NODE_ENV || 'development';

export default {
    [env]: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        migrationStorageTableName: "sequelize_meta",
        migrationStorage: "sequelize",
        seederStorage: "sequelize",
        seederStorageTableName: "sequelize_meta",
    }
}; 