const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-money');

const requestSchema = mongoose.Schema({
    request_id: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    operation_number: {
        type: String
    },
    payment_method: {
        type: String
    },
    amount: {
        type: Schema.Types.Money,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    modify_date: {
        type: Date
    }
});


const Payment = module.exports = mongoose.model('payments', requestSchema);
module.exports.get = function (callback, limit) {
    Payment.find(callback).limit(limit);
};
module.exports.getByExternalReference = function (callback, id) {
    Payment.findOne({ request_id : id }, callback);
};