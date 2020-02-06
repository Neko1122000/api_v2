const express = require('express');
const user = require('../controller/userController');
const auth = require('../middleware/authenicate');
const product = require('../controller/productController');
const cart = require('../controller/cartController');

const router = express.Router();

router.post('/api/v2/user/register', user.register);                // user.register
router.post('/api/v2/user/login', user.login);                      // user.login
router.get('/api/v2/user/me',auth.authencate, user.getSingleUser);                  // user.getSingleUser
router.get('/api/v2/user/orders',auth.authencate, user.getOrders);                  // user.getOrders
router.put('/api/v2/user', auth.authencate, user.update);                           // user.update
router.put('/api/v2/user/change-password',auth.authencate, user.changePassword);    // user.changePassword

router.post('/api/v2/products/cart/:id', auth.authencate, cart.order);
router.delete('/api/v2/products/cart/:id', auth.authencate, cart.delete);
router.put('/api/v2/products/cart/:id', auth.authencate, cart.update);
router.get('/api/v2/products/cart/:id', auth.authencate, cart.getSingleOrder);
router.get('/api/v2/products/orders', auth.authencate, cart.getOrders);
router.get('/api/v2/products/purchase', auth.authencate, cart.purchase);

router.get('/api/v2/users', auth.authencate, auth.verify, user.getUsers);                          // user.getUsers
router.delete('/api/v2/users/:id', auth.authencate, auth.verify, user.delete);

router.put('/api/v2/products/:id', auth.authencate, auth.verify, product.update);                  // product.update
router.delete('/api/v2/products/:id', auth.authencate, auth.verify, product.delete); // product.delete
router.post('/api/v2/products', auth.authencate, auth.verify, product.create);                     // product.create

router.get('/api/v2/products', product.getProducts);                 // product.getProducts
router.get('/api/v2/products/:id', product.getSingleProduct);        // product.getSingleProduct
// router.post('/api/v2/products/:id/checkout', product.checkout);      // product.checkout

module.exports = router;