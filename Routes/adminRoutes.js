const { check,body}=require('express-validator/check');

const express=require('express');

const adminControllers=require('../controllers/adminControllers');

const isAuth=require('../middleware/is_auth');

const Router=express.Router();

//Router.get('/products',adminControllers.getAdminProducts);

Router.get('/admin/add-product',adminControllers.getAddProduct);

Router.post('/admin/add-product',isAuth,
[body('title').isString().isLength({min:3}).trim()
.withMessage('Short length of title'),
body('price').isFloat().withMessage('Price must be in Float'),
body('description').isLength({min:5,max:400})]
,adminControllers.postAddProduct);



module.exports=Router;