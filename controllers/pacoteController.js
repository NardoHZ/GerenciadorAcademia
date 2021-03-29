const express = require("express");
const router = express.Router();
const Pacote = require("../models/Pacote");
const adminAut = require("../middlewares/adminAut");

// LISTAR PACOTES
router.get("/administrador/pacotes/listar", adminAut, (req, res) => {
    let admin = req.session.login;

    Pacote.findAll({
        where: { academiumId: admin.idAcademia },
        order: [['taxaDesconto', 'DESC']]
    }).then(pacotes => {
        res.render("administrador/pacotes/listar", { pacotes, admin });
    });
});

// ROTA DE FORMULÁRIO DE CADASTRO
router.get("/administrador/pacotes/cadastro", (req, res) => {
    let admin = req.session.login;

    res.render("administrador/pacotes/cadastro", { admin })
});

// DELETAR UM PACOTE
router.post("/pacotes/delete", adminAut, (req, res) => {
    let id = req.body.id;

    if (id != undefined) { //SE FOR DIFERENTE DE NULO
        if (!isNaN(id)) { //SE FOR UM NÚMERO  

            Pacote.destroy({
                where: { id }
            }).then(() => {
                res.redirect("/administrador/pacotes/listar");
            });

        } else {
            res.redirect("/administrador/pacotes/listar");
        }
    } else {
        res.redirect("/administrador/pacotes/listar");
    }
});

// SALVAR O PACOTE APÓS PREENCHER O FORMULÁRIO
router.post("/pacote/salvar", adminAut, (req, res) => {
    let admin = req.session.login;

    let nome = req.body.inputNome;
    let descricao = req.body.inputDescricao;
    let taxaDesconto = req.body.inputDesconto;

    validar = 1;

    if (nome == "" || descricao == "" || taxaDesconto == "") {
        validar = 0;
    }

    if (validar == 1) {
        Pacote.create({
            nome,
            descricao,
            taxaDesconto,
            academiumId: admin.idAcademia
        }).then(function () {
            res.redirect("/administrador/pacotes/listar");
        }).catch(function (erro) {
            res.redirect("/administrador/pacotes/listar");
        });
    } else {
        req.flash('error', 'Preencha todos os campos!');
        res.redirect("/administrador/pacotes/cadastro/");
    }

});

// EDITAR OS DADOS DE UM PACOTE
router.get("/administrador/pacotes/editar/:id", adminAut, (req, res) => {
    let admin = req.session.login;

    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/administrador/pacotes/listar")
    }

    Pacote.findByPk(id).then(pacote => {
        if (pacote != undefined) {
            res.render("administrador/pacotes/editar", { pacote, admin });
        } else {
            res.redirect("/administrador/pacotes/listar")
        }
    }).catch(erro => {
        res.redirect("/administrador/pacotes/listar")
    })
});

// SALVAR PACOTE APÓS EDIÇÃO
router.post("/pacote/update", adminAut, (req, res) => {
    let nome = req.body.inputNome;
    let descricao = req.body.inputDescricao;
    let taxaDesconto = req.body.inputDesconto
    let id = req.body.inputID;

    Pacote.update({
        nome,
        descricao,
        taxaDesconto
    }, {
        where: {
            id
        }
    }).then(function () {
        res.redirect("/administrador/pacotes/listar");
    });

});

module.exports = router;