Request = require("../models/request");
User = require("../models/User");
require("mongoose-money");
const mailer = require("../mailer/mailer");
const Money = require("moneyjs");
const REQUESTS_STATUS_SENT_BY_USER = 1;
const REQUESTS_STATUS_QUOTED_BY_ADMIN = 2;
const REQUESTS_STATUS_QUOTE_ACCEPTED = 3;
const REQUESTS_STATUS_QUOTE_REJECTED = 5;
const REQUESTS_STATUS_PRINTING = 6;
const REQUESTS_STATUS_READY_TO_DELIVER = 7;

const isAdminUpdate = status => {
  return [2, 4, 6, 7, 8].includes(status);
};

const getUpdateMessageByStatus = request => {
  switch (request.status) {
    case REQUESTS_STATUS_SENT_BY_USER:
      return "Hay un nuevo pedido para cotizar.";
    case REQUESTS_STATUS_QUOTED_BY_ADMIN:
      return `Tu pedido ${request._id} fue cotizado por un administrador.`;
    case REQUESTS_STATUS_QUOTE_ACCEPTED:
      return `La cotización del pedido ${request._id} fue aceptada.`;
    case REQUESTS_STATUS_QUOTE_REJECTED:
      return `La cotización del pedido ${request._id} fue rechazada.`;
    case REQUESTS_STATUS_PRINTING:
      return `Tu pedido ${request._id} comenzó a imprimirse.`;
    case REQUESTS_STATUS_READY_TO_DELIVER:
      return `Tu pedido ${request._id} está listo para retirar.`;
  }
};

exports.index = function(req, res) {
  Request.get(function(err, requests) {
    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    res.json({
      status: "success",
      message: "Requests retrieved successfully",
      data: requests
    });
  });
};

exports.new = function(req, res) {
  let request = new Request();
  request.material_type = req.body.material_type;
  request.color_type = req.body.color_type;
  request.diameter = req.body.diameter;
  request.status = req.body.status;
  request.created_time = req.body.created_time;
  request.file_name = req.body.file_name;
  request.created_by = req.body.created_by;

  request.save(function(err) {
    if (err) {
      res.json(err);
    }
    res.json({
      message: "New request created!",
      data: request
    });
  });
};

exports.update = (req, res) => {
  Request.findByIdAndUpdate(
    req.params.request_id,
    {
      ...req.body,
      price: req.body.price.amount
        ? new Money(req.body.price.amount)
        : new Money(req.body.price)
    },
    { new: true },
    (err, doc) => {
      if (err) {
        res.json(err);
      }

      if (isAdminUpdate(req.body.status)) {
        if (req.socketClients[req.body.created_by]) {
          const socket = req.io.sockets.connected[req.socketClients[req.body.created_by].socket];
          console.log(socket);
          socket.emit("request-notification", {
            message: getUpdateMessageByStatus(req.body),
            request: req.body
          });
        }
      } else {
        Object.keys(req.socketClients).forEach(clientId => {
          if (req.socketClients[clientId].admin === "true") {
              const socket = req.io.sockets.connected[req.socketClients[clientId].socket];
                  
              socket.emit("request-notification", {
                message: getUpdateMessageByStatus(req.body),
                request: req.body
              });
          }
        })
      }

      if (req.body.status === REQUESTS_STATUS_QUOTED_BY_ADMIN) {
        User.findOne({ _id: req.body.created_by }).then(user => {
          const quotation = { ...req.body, user };
          mailer.sendQuotationEmail(quotation).then(
            () => {
              res.json({
                message: "Updated request is",
                data: doc
              });
            },
            error => {
              console.log(error.response.body);
            }
          );
        });
      } else {
        res.json({
          message: "Updated request is",
          data: doc
        });
      }
    }
  );
};
