const { Router } = require('express'),
    DespesaCategoria = require('../models/despesaCategoria.model'),
    AuthRepository = require('../repositories/auth.repository'),
    DespesaCategoriaRepository = require('../repositories/despesaCategoria.repository');

const router = Router(),
    DespesaCategoriaController = router;

const auth = new AuthRepository();
const repository = new DespesaCategoriaRepository();

router.use('/get', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getExpenseCategories(userId, req, res);
});

router.use('/insert', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const categoria = new DespesaCategoria(req.body);

    repository.insertExpenseCategory(categoria, req, res);
});

router.use('/update', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const categoria = new DespesaCategoria(req.body);

    repository.updateExpenseCategory(categoria, req, res);
});

router.use('/delete', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const categoriaId = parseInt(req.query.CategoriaId.toString());

    repository.deleteExpenseCategory(categoriaId, req, res);
});

module.exports = DespesaCategoriaController;