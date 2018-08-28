const mongoose = require('mongoose');

const printerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Printer = module.exports = mongoose.model('printer', printerSchema);
module.exports.get = function (callback, limit) {
  Printer.find(callback).limit(limit);
};