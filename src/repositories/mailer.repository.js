const sql = require('../config/database.config'),
    Mail = require('../services/mailer/mailer'),
    Usuario = require('../models/usuario.model');

class MailerRepository {

    constructor() {
    }

    verifyUserEmail(email, req, res) {
        var script = `SELECT UsuarioId
                           , Nome
                           , Email
                        FROM Usuario
                       WHERE BINARY Email = '${email}'`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        error: error,
                        message: error.sqlMessage
                    });
                }
                else {
                    if (response.length > 0) {
                        const user = new Usuario(response[0]),
                            mail = new Mail();

                        mail.setUserInfo(user);

                        mail.setOptions(
                            user.Email,
                            '✔️ Verificar Email',
                            'EmailConfirmation'
                        );

                        mail.send(res);
                    }
                    else {
                        res.send({ success: false, message: 'Email inválido !' });
                    }
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    getUserToReset(email, req, res) {
        var script = `SELECT UsuarioId
                           , Nome
                           , Email
                        FROM Usuario
                       WHERE BINARY Email = '${email}'`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        error: error,
                        message: error.sqlMessage
                    });
                }
                else {
                    if (response.length > 0) {
                        const user = new Usuario(response[0]),
                            mail = new Mail();

                        mail.setUserInfo(user);

                        mail.setOptions(
                            user.Email,
                            '🛡️ Resetar Senha',
                            'PasswordResetConfirmation'
                        );

                        mail.send(res);
                    }
                    else {
                        res.send({ success: false, message: 'Email inválido !' });
                    }
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    resetUserPassword(userId, req, res) {
        var script = `UPDATE Usuario
                         SET Senha = SUBSTR(UUID(), 1, 6)
                       WHERE UsuarioId = ${userId}`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        error: error,
                        message: error.sqlMessage
                    });
                }
                else {
                    MailerRepository.getNewUserPassword(userId, req, res);
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static getNewUserPassword(userId, req, res) {
        var script = `SELECT UsuarioId
                           , Nome
                           , Email
                           , Senha
                        FROM Usuario
                       WHERE UsuarioId = ${userId}`;
        try {
            sql.query(script, function (error, response) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        error: error,
                        message: error.sqlMessage
                    });
                }
                else {
                    if (response.length > 0) {
                        const user = new Usuario(response[0]),
                            mail = new Mail();

                        mail.setUserInfo(user);

                        mail.setOptions(
                            user.Email,
                            '🔑 Nova Senha',
                            'PasswordReset'
                        );

                        mail.send(res, function (success, error) {
                            if (error) {
                                res.send('Não foi possível gerar uma nova senha !');
                                //res.status(301).redirect("http://localhost:4200/confirmation-response/password/false");
                            }
                            else {
                                res.send('Nova senha gerada com sucesso !');
                                //res.status(301).redirect("http://localhost:4200/confirmation-response/password/true");
                            }
                        });
                    }
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }
}


module.exports = MailerRepository;