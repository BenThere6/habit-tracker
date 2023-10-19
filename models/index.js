const { Sequelize } = require('sequelize');
const dbConfig = require('../config/sequelize');

const sequelize = new Sequelize(dbConfig);

const User = require('./user');
const Habit = require('./habit');

User.hasMany(Habit, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Habit.belongsTo(User)

module.exports = { sequelize, User, Habit };