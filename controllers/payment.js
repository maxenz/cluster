var MP = require("mercadopago");

Request = require('../models/request');
Payment = require('../models/payment');

require('mongoose-money');
const Money = require('moneyjs');
MP.configure({
    client_id: '8666928984748381',
    client_secret: 'RdBdfH1toMzLiy38kUO77LOFQwRwmtYb'
});

exports.Generate = function (req, res) {
            Request.getById(function (err, request) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err.message
                    });
                }

                var preference = {
                    payer: { email: req.body.email },
                    auto_return : 'all',
                    external_reference: request.id,
                    items: [
                        item = {
                            title: 'Cluster3D - Impresi�n (' + req.body.request_id + ')',
                            quantity: 1,
                            currency_id: 'ARS',
                            unit_price: parseFloat(request.price.amount)
                        }
                    ],
                    back_urls : {
                        success: req.body.backUrl,
                        failure: req.body.backUrl,
                        pending: req.body.backUrl
                    }
                };

                MP.preferences.create(preference)
                .then(function (preference) {
                            res.json({
                                status: "success",
                                message: "Payment generated successfully",
                                data: preference.response.sandbox_init_point
                            });
                }).catch(function (error) {
                    res.json({
                        status: "error",
                        message: error.message
                    });
                });

            }, req.body.request_id);        
}

exports.BackResponse = function(req, res){
    try
    {
        Request.getById(function (err, request) {
            if (err) {
                res.json({
                    status: "error",
                    message: err.message
                });
            }
            
            let payment = new Payment();
            payment.request_id = request.id;
            payment.amount = request.price;
            payment.state = req.query.collection_status;
            if(req.query.collection_status == 'approved'){
                payment.operation_number = req.query.collection_id;
                payment.payment_method = req.query.payment_type;
            }
            payment.modify_date = Date.now();

            payment.save(function (err) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err.message
                    });
                }

                request.payment_id = payment;
                request.save(function (err) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err.message
                        });                        
                    }

                    res.json({
                        status: "success",
                        message: "Payment registered successfully",
                        data: payment
                    });
                });
            });
        },req.query.external_reference);
    }catch(error) {
        res.json({
            status: "error",
            message: error.message
        });
    }
}
exports.Notifiy = function(req, res){
    try
    {
        var merchantOrderId = req.body.id;
        if(req.body.topic == 'payment'){
            MP.getPayment(req.body.id).then(function(payment){
            if(payment.status == 200 && payment.response.order != null)
                merchantOrderId = payment.response.order.id;
                processMerchantOrder(res, merchantOrderId);
            }).catch(function (error) {
                res.json({
                    status: "error",
                    message: error.message
                });
            });
        }else{
            processMerchantOrder(res, merchantOrderId);
        }        
    }catch(error) {
        res.json({
            status: "error",
            message: error.message
        });
    }
}

function processMerchantOrder(res, merchantOrderId){
    if(merchantOrderId != null)
        {
            MP.get('/merchant_orders/' + merchantOrderId).then(function(merchantOrder){
                if(merchantOrder != null && merchantOrder.status == 200 && merchantOrder.response.payments.length > 0){
                    let payment = Payment.getByExternalReference(function (err, request) {
                        if (err) {
                            res.json({
                                status: "error",
                                message: err.message
                            });
                        }
                    
                        payment.state = merchantOrder.response.payments[0].status;
                        if(merchantOrder.response.payments[0].status == 'approved'){
                            payment.operation_number = merchantOrder.response.collector.id;
                            payment.payment_method = merchantOrder.response.payments[0].payment_type;
                        }
                        payment.modify_date = Date.now;

                        payment.save(function () {
                            res.json({
                                status: "success",
                                message: "Payment registered successfully",
                                data: payment
                            });
                        });
                    },merchantOrder.response.external_reference);        
                }
            }).catch(function (error) {
                res.json({
                    status: "error",
                    message: error.message
                });
            });
        }
}