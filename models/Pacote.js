const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Academia = require("../models/Academia");

// Tabela Pacote
const Pacote = connection.define('pacote', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: true
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    taxaDesconto: {
        type: Sequelize.DOUBLE,
        allowNull: true
    }
});

// Gerando chave estrangeira de Academia na tabela Administrador
Academia.hasMany(Pacote);
Pacote.belongsTo(Academia); 

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// Pacote.sync({force: false});

module.exports = Pacote;