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
    if(req.body.email != null && req.body.request_id != null && req.body.backUrl != null){
            Request.getById(function (err, request) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err.message
                    });
                }
                if(request != null){
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
                }else{
                    res.json({
                        status: "error",
                        message: "Request not found"
                    });
                }
            }, req.body.request_id);        
    }else{
        res.json({
            status: "error",
            message: "Wrong parameters"
        });
    } 
}

exports.BackResponse = function(req, res){
    try
    {
        if(req.query.collection_status != null && req.query.collection_id != null && req.query.payment_type != null && req.query.external_reference != null){
            Request.getById(function (err, request) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err.message
                    });
                }
                if(request != null){
                    if(request.payment_id == null){
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
                    }else{
                        res.json({
                            status: "error",
                            message: "Payment was already registered",
                            data: null
                        });
                    }
                }else{
                res.json({
                    status: "error",
                    message: "Request not found",
                    data: null
                });
                }
            },req.query.external_reference);
        }else{
            res.json({
                status: "error",
                message: "Wrong parameters"
            });
        } 
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
        if(req.body.id != null && req.body.topic != null ){
            var merchantOrderId = req.body.id;
            if(req.body.topic == 'payment'){
                MP.getPayment(req.body.id).then(function(payment){
                if(payment.status == 200 && payment.response.order != null)
                    merchantOrderId = payment.response.order.id;
                    processMerchantOrder(res, req.body.id, merchantOrderId);
                }).catch(function (error) {
                    res.json({
                        status: "error",
                        message: error.message
                    });
                });
            }else{
                processMerchantOrder(res, merchantOrderId);
            }
        }else{
            res.json({
                status: "error",
                message: "Wrong parameters"
            });
        }        
    }catch(error) {
        res.json({
            status: "error",
            message: error.message
        });
    }
}

function processMerchantOrder(res, merchantOrderId){
    
    MP.get('/merchant_orders/' + merchantOrderId).then(function(merchantOrder){
        if(merchantOrder != null && merchantOrder.status == 200 && merchantOrder.response.payments.length > 0){
            Payment.getByExternalReference(function (err, payment) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err.message
                    });
                }  
                if(payment == null){
                    Request.getById(function (err, request) {
                        if (err) {
                            res.json({
                                status: "error",
                                message: err.message
                            });
                        }
                        
                        if(request != null){
                            let payment = new Payment();
                            payment.request_id = request.id;
                            payment.amount = request.price;
                            payment.state = merchantOrder.response.payments[0].status;
                            if(req.query.collection_status == 'approved'){
                                payment.operation_number = merchantOrder.response.collector.id;
                                payment.payment_method = merchantOrder.response.payments[0].payment_type;
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
                                        message: "Payment registered successfully.",
                                        data: payment
                                    });
                                });
                            });
                        }else{
                            res.json({
                                status: "error",
                                message: "Request not found",
                                data: null
                            });
                        }
                    }, merchantOrder.response.external_reference);
                }else{                   
                    if(payment.state != 'approved'){    
                        payment.state = merchantOrder.response.payments[0].status;
                        if(merchantOrder.response.payments[0].status == 'approved'){
                            payment.operation_number = merchantOrder.response.collector.id;
                            payment.payment_method = merchantOrder.response.payments[0].payment_type;
                        }
                        payment.modify_date = Date.now;

                        payment.save(function () {
                            res.json({
                                status: "success",
                                message: (payment.state == 'approved') ? "Payment approved successfully." : "Payment notified successfully.",
                                data: payment
                            });
                        });
                    }else{
                        res.json({
                            status: "error",
                            message: "Payment was already approved.",
                            data: payment
                        });
                    }
                }
            },merchantOrder.response.external_reference);        
        }else{
            res.json({
                status: "error",
                message: "Merchant order not found or has empty payments.",
                data: payment
            });
        }
    }).catch(function (error) {
        res.json({
            status: "error",
            message: error.message
        });
    });        
}