require('dotenv').config({ path: '../.env' })

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        migrationStorageTableName: "sequelize_meta",
        migrationStorage: "sequelize",
        seederStorage: "sequelize",
        seederStorageTableName: "sequelize_meta",
    }
};