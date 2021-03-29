const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Cliente = require("../models/Cliente"); // Importando Cliente para gerar chave estrangeira

// Tabela EnderecoCliente
const EnderecoCliente = connection.define('enderecocliente', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    logradouro: {
        type: Sequelize.STRING,
        allowNull: true
    },
    numero: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cidade: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bairro: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cep: {
        type: Sequelize.STRING,
        allowNull: true
    },
    uf: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// Gerando chave estrangeira de Cliente na tabela EnderecoCliente
Cliente.hasOne(EnderecoCliente); 
EnderecoCliente.belongsTo(Cliente); 

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// EnderecoCliente.sync({force: true}); 

module.exports = EnderecoCliente;