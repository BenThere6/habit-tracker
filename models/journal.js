const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Entries extends Model {}

Entries.init(
    {
        entry_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        habit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        entry_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        entryText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'journalEntry',
    }
);

module.exports = Entries;