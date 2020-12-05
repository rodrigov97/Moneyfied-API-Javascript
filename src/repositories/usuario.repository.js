const { Request, Response } = require('express'),
    sql = require('../config/database.config.js'),
    Usuario = require('../models/usuario.model'),
    Mail = require('../services/mailer/mailer');

class UsuarioRepository {

    constructor() {
    }

    postUser(usuario, req, res) {
        var script = `SELECT Email
                        FROM Usuario
                       WHERE BINARY Email = '${usuario.Email}'`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    UsuarioRepository.errorHandler(error, res);
                }
                else {
                    if (response.length > 0) {
                        res.status(203).send({
                            success: false,
                            message: 'Email já cadastrado',
                            response
                        });
                    }
                    else {
                        UsuarioRepository.createUser(usuario, req, res);
                    }
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static createUser(usuario, req, res) {
        var script = `INSERT
                        INTO Usuario (
                              Nome
                            , Email
                            , Senha
                            , StatusUsuarioId
                            , EmailConfirmado
                            )
                        VALUES (
                              '${usuario.Nome}'
                            , '${usuario.Email}'
                            , '${usuario.Senha}'
                            , 1
                            , false
                            );`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    UsuarioRepository.errorHandler(error, res);
                }
                else {
                    UsuarioRepository.verifyUserEmail(usuario.Email, req, res);
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static verifyUserEmail(email, req, res) {
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

                        mail.send(res, function (success, error) {
                            if (error) {
                                res.status(500).send({
                                    success: false,
                                    message: 'Usuário cadastrado, mas não foi possível enviar o email de confirmação.',
                                    emailEnviado: false
                                });
                            }
                            else {
                                res.status(200).send({
                                    success: true,
                                    message: 'Usuário cadastrado !',
                                    emailEnviado: true
                                });
                            }
                        });
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

    getUser(usuarioId, req, res) {
        var script = `SELECT Nome
                           , Email
                           , Senha
                           , ImagemPerfil
                        FROM Usuario
                       WHERE UsuarioId = '${usuarioId}'`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    UsuarioRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        usuario: new Usuario(response[0])
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    updateUser(usuario, req, res) {
        var script = `UPDATE Usuario
                         SET Nome = '${usuario.Nome}'
                           , Email = '${usuario.Email}'
                           , Senha = '${usuario.Senha}'
                       WHERE UsuarioId = ${usuario.UsuarioId};`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    UsuarioRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        message: 'Informações atualizadas.',
                        response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    updateUserProfile(usuarioId, fileName, req, res) {
        var script = `UPDATE Usuario
                         SET ImagemPerfil = '${fileName}'
                       WHERE UsuarioId = ${usuarioId};`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    UsuarioRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        message: 'Imagem de perfil atualizada.',
                        response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    updateEmailVerification(usuarioId, req, res) {
        var script = `UPDATE Usuario
                         SET EmailConfirmado = true
                       WHERE UsuarioId = ${usuarioId};`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    res.send('Email não confirmado !');
                    //res.status(301).redirect("http://localhost:4200/confirmation-response/email/false");
                }
                else {
                    res.send('Email confirmado !');
                    //res.status(301).redirect("http://localhost:4200/confirmation-response/email/true");
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static errorHandler(error, res) {
        res.status(500).send({
            error: error,
            message: error.sqlMessage
        });
    }
}

module.exports = UsuarioRepository;