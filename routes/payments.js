let router = require('express').Router();

const controller = require('../controllers/payment');

router.route('/payments/')
    .post(controller.generate)//email, request_id,backUrl
    .get(controller.backResponse)//collection_status, collection_id, payment_type, external_reference
    .put(controller.Notify);//id, topic

module.exports = router;