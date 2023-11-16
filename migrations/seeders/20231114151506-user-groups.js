'use strict';

const uuid = require('uuid');

const table = 'user_groups';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert(table, [
        {
          id: uuid.v4(),
          code: 'admin',
          date_create: new Date(),
          date_update: new Date()
        },
        {
          id: uuid.v4(),
          code: 'manager',
          date_create: new Date(),
          date_update: new Date()
        },
        {
          id: uuid.v4(),
          code: 'client',
          date_create: new Date(),
          date_update: new Date()
        },
      ], 
      {}
    );

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete(table, null, {code: 'admin'});
    await queryInterface.bulkDelete(table, null, {code: 'manager'});
    await queryInterface.bulkDelete(table, null, {code: 'client'});

  }
};
