const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Performances extends Model {}

Performances.init(
    {
        performance_id: {
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
        performance_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'performances',
    }
);

module.exports = Performances;