const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = require('../config/sequelize');

const User = require('./user');
const Habit = require('./habit');
const Performances = require('./performances');

User.hasMany(Performances, {
    foreignKey: 'user_id',
});

User.hasMany(Habit, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Habit.belongsTo(User);
Performances.belongsTo(User);

module.exports = { sequelize, User, Habit };