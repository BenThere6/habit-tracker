const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

sequelize.sync({ force: false })
  .then(() => {
    console.log('Tables created successfully, if not exist.');
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });

module.exports = sequelize;