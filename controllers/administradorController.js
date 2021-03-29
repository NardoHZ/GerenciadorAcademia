const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Administrador = require("../models/Administrador");
const EnderecoAdministrador = require("../models/EnderecoAdministrador");
const Academia = require('../models/Academia');
const Login = require("../models/Login");
const adminAut = require("../middlewares/adminAut");
const enviarEmail = require('../email/send');

// HOME DO ADMINISTRADOR
router.get("/administrador/home", adminAut, (req, res) => {
    let admin = req.session.login;

    let home = async () => {
        let academia = await Academia.findByPk(admin.idAcademia);

        res.render("administrador/home", { admin, academia });
    }

    home();
});

// AUTENTICAÇÃO
router.post("/autenticacao", (req, res) => {
    let email = req.body.email;
    let senha = req.body.senha;

    let autenticarUsuario = async () => {

        let login = await Login.findOne({
            where: { email },
            include: [
                {
                    model: Administrador, require: true,
                    include: [{ model: EnderecoAdministrador }]
                }
            ]
        });

        try {
            if (login != undefined) {

                if (login.administrador.ativo != 1) {
                    req.flash('emailInativo', 'O usuário informado está inativo.');
                    res.redirect("/");
                }

                let correct = bcrypt.compareSync(senha, login.senha);

                if (correct) {
                    sessao(login);
                } else {
                    req.flash('senhaInvalida', 'Senha inválida');
                    req.flash('eValido', 'border: 1px solid green');
                    req.flash('sInvalida', 'border: 1px solid red');
                    res.redirect("/");
                }
            } else {
                req.flash('emailInvalido', 'Email inválido');
                req.flash('eInvalido', 'border: 1px solid red');
                res.redirect("/");
            }
        } catch (err) {
            console.log('Ocorreu um erro durante a validação: ' + err);
        }

    }

    let sessao = (login) => {
        req.session.login = {
            idLogin: login.id,
            idAdmin: login.administrador.id,
            idEndereco: login.administrador.enderecoadministrador.id,
            idAcademia: login.administrador.academiumId,

            nome: login.administrador.nome,
            sobrenome: login.administrador.sobrenome,
            sexo: login.administrador.sexo,
            dataNascimento: login.administrador.dataNascimento,
            cpf: login.administrador.cpf,
            telefone: login.administrador.telefone,
            email: login.administrador.email,
            tipo: login.administrador.tipo,
            ativo: login.administrador.ativo,

            logradouro: login.administrador.enderecoadministrador.logradouro,
            numero: login.administrador.enderecoadministrador.numero,
            cidade: login.administrador.enderecoadministrador.cidade,
            bairro: login.administrador.enderecoadministrador.bairro,
            cep: login.administrador.enderecoadministrador.cep,
            uf: login.administrador.enderecoadministrador.uf
        }

        res.redirect("administrador/home");
    }

    autenticarUsuario();
});

// LISTAR TODOS OS ADMINISTRADORES INCLUINDO O ENDEREÇO
router.get("/administrador/admins/listar", adminAut, (req, res) => {
    let admin = req.session.login;

    let listarAdministradores = async () => {
        let administradores = await Administrador.findAll({
            where: { academiumId: admin.idAcademia, tipo: 'funcionario' },
            order: [['nome', 'ASC']],
            include: [
                {
                    model: EnderecoAdministrador
                }
            ]
        });

        res.render("administrador/admins/listar", { administradores, admin });
    }

    listarAdministradores();

});

// DETALHAR O ADMINISTRADOR SELECIONADO NA TABELA
router.get("/administrador/admins/detalhes/:id", adminAut, (req, res) => {
    let admin = req.session.login;

    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/administrador/admins/listar");
    }

    let detalharAdministrador = async () => {

        let administrador = await Administrador.findByPk(id, {
            include: [
                {
                    model: EnderecoAdministrador
                }
            ]
        }).catch(err => {
            res.redirect("/administrador/admins/listar");
            console.log('Não foi possível continuar com a busca do administrador: ' + err);
        });

        if (administrador != undefined) {
            res.render("administrador/admins/detalhes", { administrador, admin });
        } else {
            res.redirect("/administrador/admins/listar");
        }

    }

    detalharAdministrador();
});

// FORMULÁRIO DE CADASTRO DO ADMINISTRADOR INCLUINDO
router.get("/administrador/admins/cadastro", adminAut, (req, res) => {
    let admin = req.session.login;
    res.render("administrador/admins/cadastro", { admin });
});

// SALVAR O ADMINISTRADOR APÓS PREENCHER O FORMULÁRIO
router.post("/administrador/salvar", adminAut, (req, res) => {
    let admin = req.session.login;

    let nome = req.body.inputNome
    let sobrenome = req.body.inputSobrenome;
    let sexo = req.body.selectSexo;
    let dataNascimento = req.body.inputDate;
    let cpf = req.body.inputCPF;
    let telefone = req.body.inputTelefone;
    let email = req.body.inputEmail;
    let senha = req.body.inputSenha;
    let logradouro = req.body.inputLogradouro;
    let numero = req.body.inputNumero;
    let cidade = req.body.inputCidade;
    let bairro = req.body.inputBairro;
    let cep = req.body.inputCEP;
    let uf = req.body.selectUF;

    Login.findOne({ where: { email } }).then(emailAtual => {
        if (emailAtual == undefined) {

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(senha, salt);

            let salvarAdministrador = async () => {

                let administrador = await Administrador.create({
                    nome,
                    sobrenome,
                    sexo,
                    dataNascimento,
                    cpf,
                    telefone,
                    email,
                    tipo: 'funcionario',
                    academiumId: admin.idAcademia
                }).catch(err => {
                    res.redirect("/administrador/admins/cadastro");
                    console.log('Não foi possível cadastrar o administrador: ' + err);
                });

                await EnderecoAdministrador.create({
                    logradouro,
                    numero,
                    cidade,
                    bairro,
                    cep,
                    uf,
                    administradorId: administrador.id
                }).catch(err => {
                    res.redirect("/administrador/admins/cadastro");
                    console.log('Não foi possível cadastrar o endereço: ' + err);
                });

                await Login.create({
                    email,
                    senha: hash,
                    administradorId: administrador.id
                }).catch(err => {
                    res.redirect("/administrador/admins/cadastro");
                    console.log('Não foi possível cadastrar o login: ' + err);
                });

                res.redirect("/administrador/admins/listar");
            }

            salvarAdministrador();

        } else {
            req.flash("emailExistente", "O email informado já existe.")
            res.redirect("/administrador/admins/cadastro");
        }
    })
});

// PERFIL
router.get("/administrador/perfil", adminAut, (req, res) => {
    let admin = req.session.login;

    Administrador.findOne({
        where: {
            id: admin.idAdmin
        },
        include: [
            {
                model: EnderecoAdministrador
            }
        ]
    }).then(administrador => {
        res.render("administrador/admins/perfil", { administrador, admin })
    });

});

// EDITAR OS DADOS DO ADMINISTRADOR
router.get("/administrador/editar/dados", adminAut, (req, res) => {
    let admin = req.session.login;

    Administrador.findOne({
        where: {
            id: admin.idAdmin
        },
        include: [
            {
                model: EnderecoAdministrador
            }
        ]
    }).then(administrador => {
        res.render("administrador/admins/editarDados", { administrador, admin });
    });

});

// EDITAR SENHA DO ADMINISTRADOR
router.get("/administrador/editar/senha", adminAut, (req, res) => {
    let admin = req.session.login;
    res.render("administrador/admins/editarSenha", { admin });
});

// SALVAR NOVA SENHA
router.post("/administrador/senha/update", adminAut, (req, res) => {
    let admin = req.session.login;

    let senhaAtual = req.body.senhaAtual;
    let novaSenha = req.body.novaSenha;
    let confirmarNovaSenha = req.body.confirmarNovaSenha;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(novaSenha, salt);

    if (novaSenha != confirmarNovaSenha) {
        req.flash('error', 'As senhas não coincidem!');
        res.redirect("/administrador/editar/senha");
    }

    let atalizarSenha = async () => {

        let login = await Login.findOne({
            where: { id: admin.idLogin }
        });

        if (login != undefined) {

            let correct = bcrypt.compareSync(senhaAtual, login.senha);

            if (correct) {
                Login.update({
                    senha: hash
                }, {
                    where: { id: admin.idLogin }
                }).then(login => {
                    res.redirect("/administrador/perfil")
                });
            } else {
                req.flash('error', 'Senha inválida!');
                res.redirect("/administrador/editar/senha");
            }

        } else {
            res.redirect("/administrador/editar/senha");
        }
    }

    atalizarSenha();
});

// SALVAR DADOS DA EDIÇÃO
router.post("/administrador/dados/update", adminAut, (req, res) => {
    let admin = req.session.login;

    let nome = req.body.inputNome;
    let sobrenome = req.body.inputSobrenome;
    let sexo = req.body.selectSexo;
    let dataNascimento = req.body.inputDate;
    let cpf = req.body.inputCPF;
    let telefone = req.body.inputTelefone;
    let email = req.body.inputEmail;
    let cep = req.body.inputCEP;
    let logradouro = req.body.inputLogradouro;
    let cidade = req.body.inputCidade;
    let bairro = req.body.inputBairro;
    let numero = req.body.inputNumero;
    let uf = req.body.selectUF;

    Login.findOne({ where: { email } }).then(login => {
        if (login == undefined || email == admin.email) {

            let atualizarDados = async () => {

                await Administrador.update({
                    nome,
                    sobrenome,
                    sexo,
                    dataNascimento,
                    cpf,
                    telefone,
                    email
                }, {
                    where: { id: admin.idAdmin }
                });

                await Login.update({
                    email
                }, {
                    where: { administradorId: admin.idAdmin }
                });

                await EnderecoAdministrador.update({
                    cep,
                    logradouro,
                    cidade,
                    bairro,
                    numero,
                    uf
                }, {
                    where: { administradorId: admin.idAdmin }
                });

                res.redirect("/administrador/perfil");
            }

            atualizarDados();

        } else {
            req.flash("emailExistente", "O email informado já existe.");
            res.redirect("/administrador/editar/dados");
        }
    })
});

// ATIVAR/INATIVAR ADMINISTRADOR
router.post("/administrador/admins/status/update", (req, res) => {
    let id = req.body.inputID;
    let status = req.body.inputStatus;
    let newStatus;

    if (status.toString() == 'false') {
        newStatus = true;
    } else {
        newStatus = false;
    }

    Administrador.update({
        ativo: newStatus
    }, {
        where: {
            id
        }
    }).then(() => {
        res.redirect("/administrador/admins/detalhes/" + id);
    });
});

// DELETAR UM ADMINISTRADOR
router.post("/administrador/admins/delete", adminAut, (req, res) => {
    let id = req.body.id;

    if (id != undefined) { //SE FOR DIFERENTE DE NULO
        if (!isNaN(id)) { //SE FOR UM NÚMERO  

            Administrador.destroy({
                where: { id }
            }).then(() => {
                res.redirect("/administrador/admins/listar");
            });

        } else {
            res.redirect("/administrador/admins/listar");
        }
    } else {
        res.redirect("/administrador/admins/listar");
    }
});

// INFORMAR O EMAIL QUE FOI ESQUECIDO
router.get("/administrador/password/email", (req, res) => {
    res.render("administrador/password/email");
});

// ENVIAR LINK DE RECUPERAÇÃO
router.post("/send/link/reset", (req, res) => {
    let email = req.body.email;
    let codigo = Math.floor(Math.random() * 100000).toString();

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(codigo, salt);

    Login.findOne({
        where: {
            email
        }
    }).then(login => {
        if (login != undefined) {

            req.session.hash = hash;
            req.session.email = email;

            enviarEmail.enviarLink(email);

            req.flash("ocultar", "display: none;");
            req.flash("color", "color: green;");
            req.flash("mensagemEmail", "Um link de recuperação foi enviado para o email informado.");
            res.redirect("/administrador/password/email");

        } else {
            req.flash("color", "color: red;");
            req.flash("mensagemEmail", "Email inválido.");
            res.redirect("/administrador/password/email");
        }
    })

});

// INFORMAR NOVA SENHA
router.get("/administrador/password/reset", (req, res) => {
    if (req.session.hash != undefined) {
        res.render("administrador/password/reset");
    } else {
        req.flash("ocultar", "display: none;")
        req.flash("color", "color: red;");
        req.flash("mensagemEmail", "O link de recuperação de senha expirou!");
        res.redirect("/administrador/password/email");
    }
});

// ALTERAR A SENHA
router.post("/salvar/nova-senha", (req, res) => {
    let novaSenha = req.body.novaSenha;
    let confirmarSenha = req.body.confirmarSenha;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(novaSenha, salt);

    if (novaSenha != confirmarSenha) {
        req.flash('senhaInvalida', 'As senhas não coincidem!');
        res.redirect("/administrador/password/reset");
    }

    if (req.session.hash != undefined) {

        Login.update({
            senha: hash
        }, {
            where: {
                email: req.session.email
            }
        }).then(() => {
            req.session.hash = null;
            req.session.email = null;
            res.redirect("/");
        })

    } else {
        req.flash("ocultar", "display: none;")
        req.flash("color", "color: red;");
        req.flash("mensagemEmail", "O link de recuperação de senha expirou!");
        res.redirect("/administrador/password/email");
    }

});

// DESLOGAR
router.get("/logout", (req, res) => {
    req.session.login = undefined;
    res.redirect("/");
});

module.exports = router;