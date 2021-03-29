const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Administrador = require("../models/Administrador"); // Importando Administrador para gerar chave estrangeira

// Tabela EnderecoAdministrador
const EnderecoAdministrador = connection.define('enderecoadministradors', {
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

// Gerando chave estrangeira de Administrador na tabela EnderecoAdministrador
Administrador.hasOne(EnderecoAdministrador); 
EnderecoAdministrador.belongsTo(Administrador); 

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// EnderecoAdministrador.sync({force: true}); 

module.exports = EnderecoAdministrador;