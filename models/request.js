const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-money');

const requestSchema = mongoose.Schema({
  color_type: {
    type: Number,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  diameter: {
    type: Number,
    required: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  finish_printing_time: {
    type: Date,
  },
  material_type: {
    type: Number,
  },
  price: {
    type: Schema.Types.Money,
    index: true,
  },
  start_printing_time: {
    type: Date,
  },
  status: {
    type: Number,
    required: true,
  },
  total_printing_time: {
    type: Number,
  },
  selected_printer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Printer'
  },
});

const Request = module.exports = mongoose.model('requests', requestSchema);
module.exports.get = function (callback, limit) {
  Request.find(callback).limit(limit);
};