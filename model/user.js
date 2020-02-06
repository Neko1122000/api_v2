const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    hashPassword: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, enum: ['admin', 'user'], default: 'user'}
});

module.exports = mongoose.model('User', user);