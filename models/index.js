const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

sequelize.sync({ force: false })
  .then(() => {
    console.log('Tables created successfully, if not exist.');
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });

const User = require('./user');
const Habit = require('./habit');

User.hasMany(Habit, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Habit.belongsTo(User)

module.exports = { sequelize, User, Habit };