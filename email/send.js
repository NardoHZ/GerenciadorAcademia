var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "emailfake@gmail.com",
        pass: "00000"
    }
});

module.exports = {

    enviarLink: function (email) {
        transporter.sendMail({
            from: "Sublime <emailfake@gmail.com>",
            to: email,
            subject: "Link de Recuperação de Senha",
            text: "",
            html: `
                <h2>Para alterar sua senha, acesse o link abaixo, o link expira em 10 minutos.</h2>
                <a href="http://localhost/administrador/password/reset">Alterar senha</a>
            `
        }).then(message => {
            console.log(message);
        }).catch(err => {
            console.log(err);
        });
    }

}