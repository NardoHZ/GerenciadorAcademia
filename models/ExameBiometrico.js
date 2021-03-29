const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Cliente = require("../models/Cliente"); // Importando Cliente para gerar chave estrangeira

// Tabela ExameBiometrico
const ExameBiometrico = connection.define('examebiometrico', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    altura: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    peso: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    imc: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

// Gerando chave estrangeira de Cliente na tabela ExameBiometrico
Cliente.hasMany(ExameBiometrico);
ExameBiometrico.belongsTo(Cliente);

// Necessário para criar a base de dados. Comentar este trecho após executar o servidor
// ExameBiometrico.sync({force: false}); 

module.exports = ExameBiometrico;