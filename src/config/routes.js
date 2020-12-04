const express = require('express'),
    IndexRoutes = require('../routes/main.route'),
    UsuarioController = require('../controllers/usuario.controller');

const routesConfig = (app) => {
    const URL = '/api/v1';

    app.use(express.static('dist/Moneyfied-Web/'));

    app.use(`${URL}/user`, UsuarioController);

    // app.use(`${URL}/send-mail`, MailerController);

    // app.use(`${URL}/uploads`, UploadController);

    // app.use(`${URL}/dashboard`, DashboardController);

    // app.use(`${URL}/income`, ReceitaController);

    // app.use(`${URL}/income/categories`, ReceitaCategoriaController);

    // app.use(`${URL}/expense`, DespesaController);

    // app.use(`${URL}/expense/categories`, DespesaCategoriaController);

    // app.use(`${URL}/goal`, ObjetivoController);

    app.use(`/*`, IndexRoutes);
}

module.exports = routesConfig;