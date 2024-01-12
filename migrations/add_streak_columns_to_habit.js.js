'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('habit', 'best_streak', Sequelize.INTEGER);
    await queryInterface.addColumn('habit', 'streak_ended_date', Sequelize.DATE);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('habit', 'best_streak');
    await queryInterface.removeColumn('habit', 'streak_ended_date');
  }
};