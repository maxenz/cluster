Request = require('../models/request');
require('mongoose-money');
const Money = require('moneyjs');

exports.index = function (req, res) {
  Request.get(function (err, requests) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "Requests retrieved successfully",
      data: requests
    });
  });
};

exports.new = function (req, res) {
  let request = new Request();
  request.material_type = req.body.material_type;
  request.color_type = req.body.color_type;
  request.diameter = req.body.diameter;
  request.status = req.body.status;
  request.created_time = req.body.created_time;
  request.file_name = req.body.file_name;

  request.save(function (err) {
    if (err) {
      res.json(err);
    }
    res.json({
      message: 'New request created!',
      data: request
    });
  });
};

exports.update = (req, res) => {
  Request.findByIdAndUpdate(req.params.request_id, {
    ...req.body,
    price: req.body.price.amount ? new Money(req.body.price.amount) : new Money(req.body.price),
  }, {new: true}, (err, doc) => {
    if (err) {
      res.json(err);
    }
    res.json({
      message: 'Updated request is',
      data: doc
    });
  })
};