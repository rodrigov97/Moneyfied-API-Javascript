const sql = require('../config/database.config'),
    Mail = require('../services/mailer/mailer'),
    Usuario = require('../models/usuario.model');

class MailerRepository {

    constructor() {
        this.mail = new Mail();
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
                        const user = new Usuario(response[0]);

                        this.mail.setUserInfo(user);

                        this.mail.setOptions(
                            user.Email,
                            '✔️ Verificar Email',
                            'EmailConfirmation'
                        );

                        this.mail.send(res);
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
                        const user = new Usuario(response[0]);

                        this.mail.setUserInfo(user);

                        this.mail.setOptions(
                            user.Email,
                            '🛡️ Resetar Senha',
                            'PasswordResetConfirmation'
                        );

                        this.mail.send(res);
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
                        const user = new Usuario(response[0]);

                        this.mail.setUserInfo(user);

                        this.mail.setOptions(
                            user.Email,
                            '🔑 Nova Senha',
                            'PasswordReset'
                        );

                        this.mail.send(res, function (success, error) {
                            if (error) {
                                res.status(301).redirect("http://localhost:4200/confirmation-response/password/false");
                            }
                            else {
                                res.status(301).redirect("http://localhost:4200/confirmation-response/password/true");
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