const config = require('./mailerConfig'),
    fs = require('fs'),
    nodemailer = require("nodemailer");

class Mail {

    constructor() {
        this.mailOptions = {};
        this.user;
     }

    async send(res, callback)  {
        if (this.mailOptions === {}) return;

        const mailOptions = this.mailOptions,
            transporter = nodemailer.createTransport(config);

        const response = await transporter.sendMail(mailOptions, function (error, info) {

            if (!callback && error) {
                res.status(500).send({
                    success: false,
                    message: 'Email não enviado'
                });
            }
            else if (callback && error) {
                callback(true, error);
            }
            else if (callback && !error) {
                callback(null, null);
            }
            else {
                res.status(200).send({
                    success: true,
                    message: 'Email enviado'
                });
            }
        });

        return response;
    }

    setOptions(destinatary, subject, type) {
        const templateContent = this.getTemplate(type);
        this.mailOptions = {
            from: 'Moneyfied no-reply',
            to: destinatary,
            subject: subject,
            html: templateContent
        };
    }

    setUserInfo(user) {
        this.user = user;
    }

    getTemplate(type) {
        if (type === 'EmailConfirmation') {
            return this.emailConfirmationTemplate();
        }
        else if (type === 'PasswordResetConfirmation') {
            return this.resetPasswordConfirmationTemplate();
        }
        else if (type === 'PasswordReset') {
            return this.resetPasswordTemplate();
        }
    }

    emailConfirmationTemplate() {
        var template = fs.readFileSync('./src/services/mailer/templates/EmailConfirmation.html', { encoding: 'utf8' });

        template = template.replace('@Nome', this.user.Nome)
            .replace('@Email', this.user.Email.toString())
            .replace('@Id', this.user.UsuarioId.toString());

        return template;
    }

    resetPasswordConfirmationTemplate() {
        var template = fs.readFileSync('./src/services/mailer/templates/PasswordResetConfirmation.html', { encoding: 'utf8' });

        template = template.replace('@Nome', this.user.Nome)
            .replace('@Id', this.user.UsuarioId.toString());

        return template;
    }

    resetPasswordTemplate() {
        var template = fs.readFileSync('./src/services/mailer/templates/ResetPassword.html', { encoding: 'utf8' });

        template = template.replace('@Nome', this.user.Nome)
            .replace('@Senha', this.user.Senha)

        return template;
    }
}

module.exports = Mail;