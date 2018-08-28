let router = require('express').Router();

const controller = require('../controllers/printer');

router.route('/printers')
  .get(controller.index)
  .post(controller.new);
// router.route('/printers/:printer_id')
//   .get(controller.view)
//   .patch(controller.update)
//   .put(controller.update)
//   .delete(controller.delete);

module.exports = router;