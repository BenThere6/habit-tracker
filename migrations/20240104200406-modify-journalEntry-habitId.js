'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('journalEntry', 'habit_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('journalEntry', 'habit_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};