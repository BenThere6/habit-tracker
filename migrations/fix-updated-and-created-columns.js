'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists before adding it
    const tableInfo = await queryInterface.describeTable('habit');

    if (!tableInfo.created_at) {
      await queryInterface.addColumn('habit', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('habit', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('habit', 'created_at');
    await queryInterface.removeColumn('habit', 'updated_at');
  }
};