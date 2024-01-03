'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('journalEntry', {
      entry_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      habit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      entry_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      entry_text: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('journalEntry');
  }
};