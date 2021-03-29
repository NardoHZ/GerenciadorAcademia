const Sequelize = require("sequelize");
const connection = require("../database/connection");

// Tabela Login
const Academia = connection.define('academia', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 50
    }
});

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// Academia.sync({force: false}); 

module.exports = Academia;