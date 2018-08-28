let router = require('express').Router();

router.use(require('./printers'));
router.use(require('./requests'));

module.exports = router;