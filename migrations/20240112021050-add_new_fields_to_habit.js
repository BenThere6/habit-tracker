'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Habit', 'best_streak', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('Habit', 'streak_ended_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Habit', 'best_streak');
    await queryInterface.removeColumn('Habit', 'streak_ended_date');
  }
};
