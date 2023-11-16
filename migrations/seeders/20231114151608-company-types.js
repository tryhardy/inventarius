'use strict';

const table = 'company_types';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(table, [
      {
        id: uuid.v4(),
        code: 'businessman',
        date_create: new Date(),
        date_update: new Date()
      },
      {
        id: uuid.v4(),
        code: 'company',
        date_create: new Date(),
        date_update: new Date()
      },
    ], 
    {}
  );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(table, null, { code: 'businessman',});
    await queryInterface.bulkDelete(table, null, { code: 'company',});
  }
};
