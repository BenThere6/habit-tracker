const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = require('../config/sequelize');

const User = require('./user');
const Habit = require('./habit');

User.hasMany(Habit, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Habit.belongsTo(User)

module.exports = { sequelize, User, Habit };