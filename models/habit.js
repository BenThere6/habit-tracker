const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Habit extends Model {}

Habit.init(
  {
    habit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    habit_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    habit_type: {
      type: DataTypes.ENUM('good', 'bad'),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'habit',
  }
);

module.exports = Habit;