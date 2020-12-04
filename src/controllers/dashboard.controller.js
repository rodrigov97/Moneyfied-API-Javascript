const { Router } = require('express'),
    AuthRepository = require('../repositories/auth.repository'),
    DashboardRepository = require('../repositories/dashboard.repository');

const router = Router(),
    DashboardController = router;

const auth = new AuthRepository();
const repository = new DashboardRepository();

router.use('/income', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getIncome(userId, req, res);
});

router.use('/expense', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getExpense(userId, req, res);
});

router.use('/goal', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getGoal(userId, req, res);
});

router.use('/resume', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getResume(userId, req, res);
});

router.use('/chart-info', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getChartData(userId, req, res);
});

module.exports = DashboardController;