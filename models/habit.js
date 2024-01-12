const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Habit extends Model {
  static async deleteHabitById(habitId) {
    try {
      const deletedHabit = await Habit.destroy({
        where: {
          habit_id: habitId,
        },
      });

      if (deletedHabit === 1) {
        return { success: true, message: 'Habit deleted successfully' };
      } else {
        return { success: false, error: 'Habit not found' };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

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
    last_performed: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'habit',
  }
);

module.exports = Habit;