let router = require('express').Router();

const controller = require('../controllers/payment');

router.route('/payments/')
    .post(controller.Generate)//email, request_id,backUrl
    .get(controller.BackResponse)//id, topic
    .put(controller.Notifiy);//collection_status, collection_id, payment_type, external_reference    

module.exports = router;