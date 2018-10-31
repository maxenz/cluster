const MP = require("mercadopago");
User = require('../models/User');
Request = require('../models/request');
Payment = require('../models/payment');
const REQUESTS_STATUS_READY_TO_PRINT = 4;

require('mongoose-money');

MP.configure({
  client_id: '3542881606359725',
  client_secret: 'h30rMBfe3jojeHJxKadyL8BOjBen8JjE'
});

exports.generate = function (req, res) {
  if (req.body.request_id !== null && req.body.back_url !== null) {
    Request.getById(function (err, request) {
      if (err) {
        res.json({
          status: "error",
          message: err.message
        });
      }
      if (request !== null) {
        User.findOne({_id: request.created_by})
            .then(user => {
              const preference = {
                payer: {email: user.email},
                auto_return: 'all',
                external_reference: request._id.toString(),
                items: [
                  item = {
                    title: 'Cluster3D - Impresión (' + req.body.request_id + ')',
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: parseFloat(request.price.amount)
                  }
                ],
                back_urls: {
                  success: req.body.back_url,
                  failure: req.body.back_url,
                  pending: req.body.back_url
                }
              };

              MP.preferences.create(preference)
                  .then(function (preference) {
                    res.json({
                      status: "success",
                      message: "Payment generated successfully",
                      link: preference.response.sandbox_init_point
                    });
                  }, (error) => {
                    console.log(error);
                    res.json({
                      status: "error",
                      message: error,
                    });
                  })
            });
      }
      else {
        res.json({
          status: "error",
          message: "Request not found"
        });
      }
    }, req.body.request_id);
  }
  else {
    res.json({
      status: "error",
      message: "Wrong parameters"
    });
  }
};

exports.backResponse = function (req, res) {
  try {
    if (req.query.collection_status !== null &&
        req.query.collection_id !== null &&
        req.query.payment_type !== null &&
        req.query.external_reference !== null) {
      Request.getById(function (err, request) {
        if (err) {
          res.json({
            status: "error",
            message: err.message
          });
        }
        if (request !== null) {
          if (request.payment_id !== null) {
            let payment = new Payment();
            payment.request_id = request.id;
            payment.amount = request.price;
            payment.state = req.query.collection_status;
            if (req.query.collection_status === 'approved') {
              payment.operation_number = req.query.collection_id;
              payment.payment_method = req.query.payment_type;
            }
            payment.modify_date = Date.now();

            payment.save((err) => {
              if (err) {
                res.json({
                  status: "error",
                  message: err.message
                });
              }

              request.payment_id = payment;
              request.status = REQUESTS_STATUS_READY_TO_PRINT;
              request.save((err) => {
                if (err) {
                  res.json({
                    status: "error",
                    message: err.message
                  });
                }

                console.log(payment);
                const response = {
                  showPaymentMessage: 1,
                };
                res.json({
                  status: "success",
                  message: "Payment registered successfully",
                  data: payment
                });
              });
            });
          }
          else {
            res.json({
              status: "error",
              message: "Payment was already registered",
              data: null
            });
          }
        }
        else {
          res.json({
            status: "error",
            message: "Request not found",
            data: null
          });
        }
      }, req.query.external_reference);
    }
    else {
      res.json({
        status: "error",
        message: "Wrong parameters"
      });
    }
  }
  catch (error) {
    res.json({
      status: "error",
      message: error.message
    });
  }
};

exports.Notify = function (req, res) {
  try {
    if (req.body.id != null && req.body.topic != null) {
      let merchantOrderId = req.body.id;
      if (req.body.topic === 'payment') {
        MP.getPayment(req.body.id).then(function (payment) {
          if (payment.status === 200 && payment.response.order != null) {
            merchantOrderId = payment.response.order.id;
          }
          processMerchantOrder(res, req.body.id, merchantOrderId);
        }).catch(function (error) {
          res.json({
            status: "error",
            message: error.message
          });
        });
      }
      else {
        processMerchantOrder(res, merchantOrderId);
      }
    }
    else {
      res.json({
        status: "error",
        message: "Wrong parameters"
      });
    }
  }
  catch (error) {
    res.json({
      status: "error",
      message: error.message
    });
  }
};

function processMerchantOrder(res, merchantOrderId) {

  MP.get('/merchant_orders/' + merchantOrderId).then(function (merchantOrder) {
    if (merchantOrder != null && merchantOrder.status === 200 && merchantOrder.response.payments.length > 0) {
      Payment.getByExternalReference(function (err, payment) {
        if (err) {
          res.json({
            status: "error",
            message: err.message
          });
        }
        if (payment === null) {
          Request.getById((err, request) => {
            if (err) {
              res.json({
                status: "error",
                message: err.message
              });
            }

            if (request !== null) {
              let payment = new Payment();
              payment.request_id = request.id;
              payment.amount = request.price;
              payment.state = merchantOrder.response.payments[0].status;
              if (req.query.collection_status === 'approved') {
                payment.operation_number = merchantOrder.response.collector.id;
                payment.payment_method = merchantOrder.response.payments[0].payment_type;
              }
              payment.modify_date = Date.now();

              payment.save((err) => {
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
            }
            else {
              res.json({
                status: "error",
                message: "Request not found",
                data: null
              });
            }
          }, merchantOrder.response.external_reference);
        }
        else {
          if (payment.state !== 'approved') {
            payment.state = merchantOrder.response.payments[0].status;
            if (merchantOrder.response.payments[0].status === 'approved') {
              payment.operation_number = merchantOrder.response.collector.id;
              payment.payment_method = merchantOrder.response.payments[0].payment_type;
            }
            payment.modify_date = Date.now;

            payment.save(() => {
              res.json({
                status: "success",
                message: (payment.state === 'approved') ? "Payment approved successfully." : "Payment notified successfully.",
                data: payment
              });
            });
          }
          else {
            res.json({
              status: "error",
              message: "Payment was already approved.",
              data: payment
            });
          }
        }
      }, merchantOrder.response.external_reference);
    }
    else {
      res.json({
        status: "error",
        message: "Merchant order not found or has empty payments.",
        data: payment
      });
    }
  }).catch((error) => {
    res.json({
      status: "error",
      message: error.message
    });
  });
}