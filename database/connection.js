const Sequelize = require("sequelize");

const connection = new Sequelize('sublimeteste', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;
