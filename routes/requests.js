let router = require('express').Router();

const controller = require('../controllers/request');

router.route('/requests')
  .get(controller.index)
  .post(controller.new);
// router.route('/requests/:request_id')
//   .get(controller.view)
//   .patch(controller.update)
//   .put(controller.update)
//   .delete(controller.delete);

module.exports = router;