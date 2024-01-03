const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = require('../config/sequelize');

const User = require('./user');
const Habit = require('./habit');
const Entries = require('./journal');
const Performances = require('./performances');

User.hasMany(Performances, {
    foreignKey: 'user_id',
});

User.hasMany(Habit, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

User.hasMany(Entries, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Habit.belongsTo(User);
Performances.belongsTo(User);
Entries.belongsTo(User);

module.exports = { sequelize, User, Habit, Performances, Entries };