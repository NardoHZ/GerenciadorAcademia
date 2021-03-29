const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Cliente = require("../models/Cliente"); // Importando Cliente para gerar chave estrangeira

// Tabela Mensalidade
const Mensalidade = connection.define('mensalidade', {
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

// Gerando chave estrangeira de Cliente na tabela Mensalidade
Cliente.hasMany(Mensalidade);
Mensalidade.belongsTo(Cliente);

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// Mensalidade.sync({force: true}); 

module.exports = Mensalidade;