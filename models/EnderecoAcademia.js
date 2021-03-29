const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Academia = require("../models/Academia"); // Importando Academia para gerar chave estrangeira

// Tabela EnderecoAcademia
const EnderecoAcademia = connection.define('enderecoacademia', {
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

// Gerando chave estrangeira de Academia na tabela EnderecoAcademia
Academia.hasOne(EnderecoAcademia); 
EnderecoAcademia.belongsTo(Academia); 

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// EnderecoAcademia.sync({force: true}); 

module.exports = EnderecoAcademia;