let router = require('express').Router();

router.use(require('./printers'));
router.use(require('./requests'));
router.use(require('./payments'));

module.exports = router;