const { Router, Request, Response } = require('express'),
    Despesa = require('../models/despesa.model'),
    AuthRepository = require('../repositories/auth.repository'),
    DespesaRepository = require('../repositories/despesa.repository');

const router = Router(),
    DespesaController = router;

const auth = new AuthRepository();
const repository = new DespesaRepository();

router.use('/get', auth.verifyJWT, (req, res) => {

    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString()),
        month = parseInt(req.query.month.toString()),
        year = parseInt(req.query.year.toString()),
        categoryId = parseInt(req.query.categoryId.toString()),
        start = parseInt(req.query.start.toString()),
        limit = parseInt(req.query.limit.toString());

    repository.getExpense(userId, start, limit, categoryId, month, year, req, res);
});

router.use('/insert', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receita = new Despesa(req.body);

    repository.insertExpense(receita, req, res);
});

router.use('/update', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receita = new Despesa(req.body);

    repository.updateExpense(receita, req, res);
});

router.use('/delete', (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receitaId = parseInt(req.query.receitaId.toString());

    repository.deleteExpense(receitaId, req, res);
});

router.use('/info', (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString()),
        date = new Date(),
        month = req.query.month ? parseInt(req.query.month.toString()) : date.getMonth() + 1,
        year = req.query.year ? parseInt(req.query.year.toString()) : date.getFullYear();

    repository.getExpenseResume(userId, month, year, req, res);
});

module.exports = DespesaController;