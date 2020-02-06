const mongoose = require('mongoose');

const Product = new mongoose.Schema({
   name: {type: String, required: true, trim: true},
   price: {type: Number, required: true, min: 1},
});

module.exports = mongoose.model('Product', Product);