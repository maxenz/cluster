const mongoose = require('mongoose');

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
    type: mongoose.Schema.Types.Decimal128,
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
  }

});

const Request = module.exports = mongoose.model('requests', requestSchema);
module.exports.get = function (callback, limit) {
  Request.find(callback).limit(limit);
};