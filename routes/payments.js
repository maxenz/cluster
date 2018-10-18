let router = require('express').Router();

const controller = require('../controllers/payment');

router.route('/payments/')
    .post(controller.Generate)//email, request_id,backUrl
    .get(controller.BackResponse)//collection_status, collection_id, payment_type, external_reference
    .put(controller.Notifiy);//id, topic

module.exports = router;