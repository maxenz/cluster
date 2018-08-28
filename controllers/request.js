Request = require('../models/request');

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
  request.name = req.body.name ? req.body.name : printer.name;

  request.save(function (err) {
    if (err)
      res.json(err);
    res.json({
      message: 'New request created!',
      data: request
    });
  });
};