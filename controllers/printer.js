Printer = require('../models/printer');
// Handle index actions
exports.index = function (req, res) {
  Printer.get(function (err, printers) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "Printers retrieved successfully",
      data: printers
    });
  });
};

exports.new = function (req, res) {
  let printer = new Printer();
  printer.name = req.body.name ? req.body.name : printer.name;
  printer.status = req.body.status;

  printer.save(function (err) {
    if (err)
      res.json(err);
    res.json({
      message: 'New printer created!',
      data: printer
    });
  });
};