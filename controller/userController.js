const UserController = require('../model/User');
const Cart = require('../model/Cart');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/secretKey');

const parse = require('../helpers/getNumber');

exports.register = async (req, res) =>{
    try {
        const {body: {name, email, password}} = req;
        const hashPassword = bcrypt.hashSync(password, 10);
        const newUser = await UserController.create({
            name, email, hashPassword,
        });
        Cart.create({userId: newUser._id});

        const token = jwt.sign({id: newUser._id}, config.secret, {expiresIn: 86400});

        res.status(200).send(token);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }

};

exports.login = async (req, res) => {
    try{
        const {body: {email, password}} = req;
        const user = await UserController.findOne({email: email});
        if (!user) return res.status(404).send('email/password incorrect');

        const verify = bcrypt.compareSync(password, user.hashPassword);
        if (!verify) return res.status(404).send('email/password incorrect');

        const token = await jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
        res.status(200).send(token);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {userId, body: data} = req;
        UserController.updateOne({_id: userId}, {$set: data});
        res.status(200).send("Successfully update");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        UserController.deleteOne({_id: req.userId});
        res.status(200).send("Successfully Delete");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.changePassword = async (req, res) => {
    try {
        const {body: {old_password: oldPassword, new_password: newPassword}, userId} = req;
        const user = await UserController.findOne({_id: userId});

        const verify = bcrypt.compareSync(oldPassword, user.hashPassword);
        if (!verify) return res.status(200).send("Password don't match");
        const newHashPassword = bcrypt.hashSync(newPassword, 10);
        UserController.updateOne({_id: userId}, {$set: {hashPassword: newHashPassword}});

        res.status(200).send('Password changed');
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const user = await UserController.findById(req.userId).select({hashPassword: 0, _id: 0}).lean();
        res.status(200).send(user);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const {query: {page: pag, limit: lim, sort_by: sortType}, userId} = req;
        // const page = Math.max(Number(pag) || 1, 1);
        // const limit = Math.max(Number(lim) || 1, 1);

        const page = await parse.getNumberIfPossitive(pag) || 1;
        const limit = await parse.getNumberIfPossitive(lim) || 10;

        const result = await UserController.find()
                                 .select({hashPassword: 0})
                                 .skip((page-1)*limit)
                                 .limit(limit)
                                 .sort(sortType)
                                 .lean();

        res.status(200).send(result);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
}

exports.getOrders = async (req, res) => {
    try {
        const order = await Cart.findOne({userId: req.userId}).lean();
        res.status(200).send(order);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
}