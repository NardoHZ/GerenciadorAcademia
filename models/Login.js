const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Administrador = require("../models/Administrador"); // Importando Administrador para gerar chave estrangeira

// Tabela Login
const Login = connection.define('login', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Gerando chave estrangeira de Administrador na tabela Login
Administrador.hasOne(Login);
Login.belongsTo(Administrador);

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// Login.sync({force: false}); 

module.exports = Login;