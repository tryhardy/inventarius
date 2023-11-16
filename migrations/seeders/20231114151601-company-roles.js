'use strict';

const table = 'company_roles';

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
          code: 'worker',
          date_create: new Date(),
          date_update: new Date()
        },
      ], 
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(table, null, { code: 'admin',});
    await queryInterface.bulkDelete(table, null, { code: 'worker',});
  }
};
