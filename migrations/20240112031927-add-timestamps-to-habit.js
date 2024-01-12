'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists before adding it
    const tableInfo = await queryInterface.describeTable('habit');

    if (!tableInfo.createdAt) {
      await queryInterface.addColumn('habit', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!tableInfo.updatedAt) {
      await queryInterface.addColumn('habit', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('habit', 'createdAt');
    await queryInterface.removeColumn('habit', 'updatedAt');
  }
};