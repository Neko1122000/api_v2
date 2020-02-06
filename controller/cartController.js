const CartController = require('../model/Cart');
const lineItem = require('../model/lineItem');
const parse = require('../helpers/getNumber');

exports.order = async (req, res) => {
    try {
        const {params: {id: productId}, body: {quantity: quantity}, userId} = req;
        if (quantity <= 0) return res.status(200).send("Quantity must be larger than 0");

        const Item = await lineItem.create({
            productId, quantity,
        });
        await CartController.updateOne({userId: userId}, {$push: {order: Item._id}});
        res.status(200).send("Successfully order");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {params: {id: orderId}, body: {quantity: quantity}} = req;
        await lineItem.updateOne({_id: orderId}, {$set: {quantity: quantity}});
        res.status(200).send("Successfully order");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const {params: {id: orderId}, userId} = req;
        await lineItem.deleteOne({_id: orderId});
        await CartController.updateOne({userId: userId}, {$pull: {order: orderId}});
        res.status(200).send("Successfully delete");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getSingleOrder = async (req, res) => {
    try {
        const {params: {id: orderId}} = req;
        const Item = await lineItem.findById(orderId).populate('productId').lean();
        res.status(200).send(Item);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const {limit: lim, page: pag, sort_by: sortType} = req.query;
        const page = await parse.getNumberIfPossitive(pag) || 1;
        const limit = await parse.getNumberIfPossitive(lim) || 10;

        const cart = await CartController.findOne({userId: req.userId});
        const orders = await lineItem.find({_id: {$in: cart.order}})
                                     .skip((page-1)*limit)
                                     .limit(limit)
                                     .sort(sortType)
                                     .populate('productId')
                                     .lean();
        res.status(200).send(orders);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.purchase = async (req, res) => {
    try {
        const cart = await CartController.findOneAndUpdate({userId: req.userId}, {$set: {order: []}});
        await lineItem.deleteMany({_id: {$in: cart.order}});
        res.status(200).send(cart.order);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};