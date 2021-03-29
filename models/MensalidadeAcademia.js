const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Academia = require("../models/Academia"); // Importando Academia para gerar chave estrangeira

// Tabela MensalidadeAcademia
const MensalidadeAcademia = connection.define('mensalidadeacademia', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    valor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 50
    },
    dataEmissao: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    dataVencimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    dataPagamento: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    formaPagamento: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Em aberto'
    }
});

// Gerando chave estrangeira de Academia na tabela MensalidadeAcademia
Academia.hasMany(MensalidadeAcademia);
MensalidadeAcademia.belongsTo(Academia);

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// MensalidadeAcademia.sync({force: true});

module.exports = MensalidadeAcademia;