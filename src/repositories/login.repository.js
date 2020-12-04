const jwt = require('jsonwebtoken'),
    Usuario = require('../models/usuario.model'),
    sql = require('../config/database.config'),
    dotenv = require('dotenv');

dotenv.config({ path: '.env' });

class LoginRepository {

    constructor() { }

    getLogin(usuario, req, res) {
        var script = `SELECT UsuarioId
                           , Nome
                           , Email
                           , StatusUsuarioId
                           , EmailConfirmado
                        = require(Usuario 
                       WHERE BINARY Email = BINARY '${usuario.Email}' 
                         AND BINARY Senha = BINARY '${usuario.Senha}'
                         AND StatusUsuarioId = 1;`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        error: error,
                        message: error.sqlMessage
                    });
                }
                else if (response.length < 1) {
                    res.status(200).send({
                        success: false,
                        message: 'Email ou senha inválidos !'
                    });
                }
                else {
                    var token = LoginRepository.generateToken(response[0]);

                    res.send(token);
                }
            });
        }
        catch (err) {
            res.status(500).send({ success: false, error: err, message: err.message });
        }
    }

    static generateToken(dados) {
        const usuario = {
            UsuarioId: dados.UsuarioId,
            Nome: dados.Nome,
            Email: dados.Email,
            EmailConfirmado: dados.EmailConfirmado
        };
        var token = jwt.sign(usuario, process.env.MONEYFIED_API_SECRET);

        var tokenVerification = LoginRepository.verifyJWT(token);

        return tokenVerification;
    }

    static verifyJWT(token) {
        if (!token) {
            return {
                success: false,
                error: 401,
                message: 'Token não informado.'
            };
        }
        else {
            var result = jwt.verify(token, process.env.MONEYFIED_API_SECRET, function (error, usuario) {
                if (error)
                    return {
                        success: false,
                        error: 403,
                        message: 'Acesso não autorizado.'
                    };

                return {
                    success: true,
                    token: token,
                    usuario: new Usuario(usuario)
                };
            });

            return result;
        }
    }
}

module.exports = LoginRepository;