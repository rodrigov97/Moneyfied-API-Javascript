const { Router } = require('express'),
    LoginRepository = require('../repositories/login.repository'),
    Usuario = require('../models/usuario.model');

const router = Router(),
    LoginController = router;

const repository = new LoginRepository();

router.use('/', (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No credentials.'
        });

    var usuario = req.body && new Usuario(req.body);

    repository.getLogin(usuario, req, res);
});

module.exports = LoginController;