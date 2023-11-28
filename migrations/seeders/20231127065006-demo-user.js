'use strict';

const uuid = require('uuid');
require('dotenv').config({ path: '../../.env' })
const crypto = require('crypto');

const table = 'users';
const demo_password = process.env.DEMO_USER_PASSWORD ? process.env.DEMO_USER_PASSWORD : '12345678';
const salt = crypto.randomBytes(16).toString('hex');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let userGroups = await queryInterface.sequelize.query(
      'SELECT * FROM "user_groups" WHERE code = ? ', {
        replacements: ['admin'],
        type: queryInterface.sequelize.QueryTypes.SELECT
    })

    if (userGroups.length > 0) {
      let userGroupAdminId = userGroups[0].id;
      await queryInterface.bulkInsert(
        table, 
        [
          {
            id: uuid.v4(),
            group_id: userGroupAdminId,
            name: 'Admin',
            last_name: 'Admin',
            email: 'n.garashchenko@uplab.ru',
            salt: salt,
            password: crypto.pbkdf2Sync(demo_password, salt, 1000, 64, `sha512`).toString(`hex`),
            date_create: new Date(),
            date_update: new Date(),
            active: true
          },
        ], 
        {}
      );
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(table, null, {email: 'n.garashchenko@uplab.ru'});
  }
};