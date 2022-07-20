const express=require('express');

const shopController=require('../controllers/shopController');
const isAuth=require('../middleware/is_auth');

const Router=express.Router();

Router.get('/index',shopController.getIndex);

Router.get('/',shopController.moveToGetIndex);

Router.get('/index/:category',shopController.getIndexCategory);

Router.get('/product/:id',shopController.getProduct);

Router.post('/cart',isAuth,shopController.postCart);

Router.get('/cart',isAuth,shopController.cart);

Router.delete('/cart/:productId',isAuth,shopController.postCartDelete);





module.exports=Router;