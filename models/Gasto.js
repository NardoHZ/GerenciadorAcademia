const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Academia = require("../models/Academia");

// Tabela Pacote
const Gasto = connection.define('gasto', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
    },
    valor: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

// Gerando chave estrangeira de Academia na tabela Administrador
Academia.hasMany(Gasto);
Gasto.belongsTo(Academia); 

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// Gasto.sync({force: false});

module.exports = Gasto;