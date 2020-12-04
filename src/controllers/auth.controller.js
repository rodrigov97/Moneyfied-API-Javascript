const express = require('express'),
    jwt = require('jsonwebtoken');
dotenv = require('dotenv');

dotenv.config({ path: '.env' });

class AuthController {

    constructor() { }

    verifyJWT(request, response, next) {

        var authHeader = request.headers['authorization'],
            token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            response.status(401).send({
                success: false,
                message: 'Token não informado.'
            });
        }
        else {
            jwt.verify(token.replace('"', ''), process.env.MONEYFIED_API_SECRET, function (error, usuario) {
                if (error) {
                    response.status(403).send({
                        success: false,
                        error,
                        message: 'Acesso não autorizado.'
                    });
                }
                else {
                    request.usuario = usuario;

                    next();
                }
            });
        }
    }
}

module.exports = AuthController;