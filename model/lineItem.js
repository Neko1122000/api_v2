const mongoose = require('mongoose');
const product = require('../model/product');

const lineItem = new mongoose.Schema({
   productId: {type: mongoose.Schema.Types.ObjectId, ref: product},
   quantity: {type: Number, min: 1},
   createAt: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('lineItem', lineItem);