const express = require("express");
const router = express.Router();
const connection = require("../database/connection");
const Cliente = require("../models/Cliente");
const EnderecoCliente = require("../models/EnderecoCliente");
const Pacote = require("../models/Pacote");
const Sequelize = require("sequelize");
const adminAut = require("../middlewares/adminAut");


// LISTAR TODOS OS CLIENTES INCLUINDO O PACOTE E O ENDEREÇO
router.get("/administrador/clientes/listar", adminAut, (req, res) => {
    let admin = req.session.login;

    let listarClientes = async () => {
        let clientes = await Cliente.findAll({
            where: { academiumId: admin.idAcademia },
            order: [['nome', 'ASC']],
            include: [
                {
                    model: EnderecoCliente
                },
                {
                    model: Pacote
                }
            ]
        });

        res.render("administrador/clientes/listar", { clientes, admin });
    }

    listarClientes();

});

// LISTAR OS CLIENTES ATIVOS INCLUINDO O PACOTE E O ENDEREÇO
router.get("/administrador/clientes/ativos", adminAut, (req, res) => {
    let admin = req.session.login;

    let listarClientes = async () => {
        let clientes = await Cliente.findAll({
            where: { academiumId: admin.idAcademia },
            order: [['nome', 'ASC']],
            include: [
                {
                    model: EnderecoCliente
                },
                {
                    model: Pacote
                }
            ]
        });

        res.render("administrador/clientes/ativos", { clientes, admin });
    }
    listarClientes();

});

// LISTAR OS CLIENTES INATIVOS INCLUINDO O PACOTE E O ENDEREÇO
router.get("/administrador/clientes/inativos", adminAut, (req, res) => {
    let admin = req.session.login;

    let listarClientes = async () => {
        let clientes = await Cliente.findAll({
            where: { academiumId: admin.idAcademia },
            order: [['nome', 'ASC']],
            include: [
                {
                    model: EnderecoCliente
                },
                {
                    model: Pacote
                }
            ]
        });

        res.render("administrador/clientes/inativos", { clientes, admin });
    }

    listarClientes();
});

// FORMULÁRIO DE CADASTRO DO CLIENTE INCLUINDO O PACOTE
router.get("/administrador/clientes/cadastro", adminAut, (req, res) => {
    let admin = req.session.login;

    let formularioCadastro = async () => {

        let pacote = await Pacote.findAll({
            where: { academiumId: admin.idAcademia }
        });

        res.render("administrador/clientes/cadastro", { pacote, admin });
    }

    formularioCadastro();
});

// SALVAR O CLIENTE APÓS PREENCHER O FORMULÁRIO
router.post("/clientes/salvar", adminAut, (req, res) => {
    let admin = req.session.login;

    let nome = req.body.inputNome
    let sobrenome = req.body.inputSobrenome;
    let sexo = req.body.selectSexo;
    let dataNascimento = req.body.inputDate;
    let cpf = req.body.inputCPF;
    let telefone = req.body.inputTelefone;
    let email = req.body.inputEmail;
    let pacoteId = req.body.selectPacote;
    let formaPagamento = req.body.selectPagamento;
    let logradouro = req.body.inputLogradouro;
    let numero = req.body.inputNumero;
    let cidade = req.body.inputCidade;
    let bairro = req.body.inputBairro;
    let cep = req.body.inputCEP;
    let uf = req.body.selectUF;

    let salvarCliente = async () => {

        let cliente = await Cliente.create({
            nome,
            sobrenome,
            sexo,
            dataNascimento,
            cpf,
            telefone,
            email,
            academiumId: admin.idAcademia,
            pacoteId
        }).catch(err => {
            res.redirect("/administrador/clientes/cadastro");
            console.log('Não foi possível cadastrar o cliente: ' + err);
        });

        let enderecoCliente = await EnderecoCliente.create({
            logradouro,
            numero,
            cidade,
            bairro,
            cep,
            uf,
            clienteId: cliente.id
        }).catch(err => {
            res.redirect("/administrador/clientes/cadastro");
            console.log('Não foi possível cadastrar o endereço: ' + erro);
        });

        await connection.query(`call primeiraMensalidadePaga('${admin.idAcademia}','${pacoteId}', '${formaPagamento}')`, {
            type: Sequelize.DataTypes.INSERT
        });

        connection.query(`call primeiraMensalidadeAberta(${admin.idAcademia})`, {
            type: Sequelize.DataTypes.INSERT
        });

        res.redirect("/administrador/clientes/listar");
    }

    salvarCliente();
});

// DETALHAR O CLIENTE SELECIONADO NA TABELA
router.get("/administrador/clientes/detalhes/:id", adminAut, (req, res) => {
    let admin = req.session.login;

    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/administrador/clientes/listar");
    }

    let detalharCliente = async () => {

        let cliente = await Cliente.findByPk(id, {
            include: [
                {
                    model: Pacote
                },
                {
                    model: EnderecoCliente
                }
            ]
        }).catch(err => {
            res.redirect("/administrador/clientes/listar");
            console.log('Não foi possível continuar com a busca do cliente: ' + err);
        });

        if (cliente != undefined) {
            res.render("administrador/clientes/detalhes", { cliente, admin });
        } else {
            res.redirect("/administrador/clientes/listar");
        }

    }

    detalharCliente();
});

// EDITAR UM CLIENTE SELECIONADO NA TABELA
router.get("/administrador/clientes/editar/:id", adminAut, (req, res) => {
    let admin = req.session.login;

    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/administrador/clientes/editar");
    }

    let formularioEdicao = async () => {

        let pacote = await Pacote.findAll({
            where: { academiumId: admin.idAcademia }
        }).catch(err => {
            res.redirect("/administrador/clientes/listar");
            console.log('Não foi possível continuar a busca do pacote: ' + err);
        });

        let cliente = await Cliente.findByPk(id, {
            include: [
                {
                    model: Pacote
                },
                {
                    model: EnderecoCliente
                }
            ]
        }).catch(err => {
            res.redirect("/administrador/clientes/listar");
            console.log('Não foi possível continuar a busca do cliente: ' + err);
        });

        if (cliente != undefined) {
            res.render("administrador/clientes/editar", { cliente, pacote, admin });
        } else {
            res.redirect("/administrador/clientes/listar");
        }

    }

    formularioEdicao();
});

// SALVAR DADOS DA EDIÇÃO
router.post("/administrador/clientes/update", adminAut, (req, res) => {
    let id = req.body.inputID;
    let nome = req.body.inputNome
    let sobrenome = req.body.inputSobrenome;
    let sexo = req.body.selectSexo;
    let dataNascimento = req.body.inputDate;
    let cpf = req.body.inputCPF;
    let telefone = req.body.inputTelefone;
    let email = req.body.inputEmail;
    let pacoteId = req.body.selectPacote;
    let logradouro = req.body.inputLogradouro;
    let numero = req.body.inputNumero;
    let cidade = req.body.inputCidade;
    let bairro = req.body.inputBairro;
    let cep = req.body.inputCEP;
    let uf = req.body.selectUF;

    let atualizarDados = async () => {

        let cliente = await Cliente.update({
            nome,
            sobrenome,
            sexo,
            dataNascimento,
            cpf,
            telefone,
            email,
            pacoteId
        }, {
            where: { id }
        }).catch(err => {
            console.log('Ocorreu um erro ao tentar atualizar os dados: ' + err);
        });

        let enderecoCliente = await EnderecoCliente.update({
            logradouro,
            numero,
            cidade,
            bairro,
            cep,
            uf
        }, {
            where: { clienteId: id }
        }).catch(err => {
            console.log('Ocorreu um erro ao tentar atualizar os dados: ' + err);
        });

        res.redirect("/administrador/clientes/detalhes/" + id);

    }

    atualizarDados();
});

// ATIVAR/INATIVAR CLIENTE
router.post("/administrador/clientes/status/update", (req, res) => {
    let admin = req.session.login;
    let id = req.body.inputID;
    let status = req.body.inputStatus;
    let newStatus;

    if (status.toString() == 'false') {
        newStatus = true;
    } else {
        newStatus = false;
    }

    Cliente.update({
        ativo: newStatus
    }, {
        where: {
            id
        }
    }).then(() => {

        connection.query(`call gerarExcluirMensalidade(${id}, ${admin.idAcademia})`, {
            type: Sequelize.DataTypes.INSERT
        });

        res.redirect("/administrador/clientes/detalhes/" + id);
    });
});

// DELETAR UM CLIENTE
router.post("/administrador/clientes/delete", adminAut, (req, res) => {
    let id = req.body.id;

    if (id != undefined) { //SE FOR DIFERENTE DE NULO
        if (!isNaN(id)) { //SE FOR UM NÚMERO  

            Cliente.destroy({
                where: { id }
            }).then(() => {
                res.redirect("/administrador/clientes/listar");
            });

        } else {
            res.redirect("/administrador/clientes/listar");
        }
    } else {
        res.redirect("/administrador/clientes/listar");
    }
});

module.exports = router;