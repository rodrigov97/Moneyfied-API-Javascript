const { Router } = require('express');

const router = Router(),
    IndexRoutes = router;

router.get('/', (req, res) => {
    res.sendFile('dist/Moneyfied-Web/index.html', { root: '.' });
});

module.exports = IndexRoutes;