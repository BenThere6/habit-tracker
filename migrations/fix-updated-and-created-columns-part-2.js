'use strict';

module.exports = {
  down: async (queryInterface, Sequelize) => {
    // Check if the column already exists before adding it
    const tableInfo = await queryInterface.describeTable('habit');

    if (!tableInfo.created_at) {
      await queryInterface.addColumn('habit', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('habit', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('habit', 'createdAt');
    await queryInterface.removeColumn('habit', 'updatedAt');
  }
};