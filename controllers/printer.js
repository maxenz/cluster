Printer = require('../models/printer');
// Handle index actions
exports.index = (req, res) => {    
  Printer.get(function (err, printers) {  
    req.io.emit("news", { desde: "controller" });  
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

exports.new = (req, res) => {
  let printer = new Printer();
  printer.name = req.body.name ? req.body.name : printer.name;
  printer.status = req.body.status;

  printer.save(function (err) {
    if (err) {
      res.json(err);
    }
    res.json({
      message: 'New printer created!',
      data: printer
    });
  });
};

exports.delete = (req, res) => {
  Printer.findByIdAndRemove(req.params.printer_id, (err, doc) => {
    if (err) {
      res.json(err);
    }
    res.json({
      message: 'Removed printer is',
      data: doc
    });
  });
};

exports.update = (req, res) => {
  Printer.findByIdAndUpdate(req.params.printer_id, req.body, {new: true}, (err, doc) => {
    if (err) {
      res.json(err);
    }
    res.json({
      message: 'Updated printer is',
      data: doc
    });
  })
};