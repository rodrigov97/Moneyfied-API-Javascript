const { Router } = require('express');

const router = Router(),
    IndexRoutes = router;

router.get('/', (req, res) => {
    res.send('Inserir home page');
});

module.exports = IndexRoutes;