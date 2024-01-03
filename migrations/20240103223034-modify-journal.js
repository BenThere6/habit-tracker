'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('journalEntry', 'habit_id', {
            type: Sequelize.INTEGER,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('journalEntry', 'habit_id', {
            type: Sequelize.INTEGER,
            allowNull: false
        });
    }
};