const User = require('../model/user');
const bcrypt = require('bcryptjs');

const newUser = new User({
    name: 'admin',
    email: 'admin@gmail.com',
    hashPassword: bcrypt.hashSync('admin', 10),
    role: 'admin',
});

User.create(newUser)
    .then(function () {
    })
    .catch(err => {
        console.log(err);
    });