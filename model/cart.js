const mongoose = require('mongoose');
const lineItem = require('../model/lineItem');
const user = require('../model/user');

const Cart = new mongoose.Schema({
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: lineItem
    }],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: user},
});

module.exports = mongoose.model('Cart', Cart);