const express=require('express');
const { check,body, validationResult }=require('express-validator/check');
const isAuth=require('../middleware/is_auth');

const authController=require('../controllers/adminAuth');
const User = require('../models/User');

const Router=express.Router();

Router.post('/admin/signup',
[check('email').isEmail().withMessage('Please enter a valid email'),
body('email').custom((value,{req})=>{
    return User.findOne({where:{email:value}})
     .then(user=>{
         if(user)
         {
           return Promise.reject(
               'E-Mail exists already, please pick a different one.'
             );
         }
         return true;
     })
 }),
 body('password',
 'Please enter a password with only text and number and at least 5 characters').
 isLength({min:5}).isAlphanumeric(),
  body('conPassword').custom((value,{req})=>{
      if(value!==req.body.password){
      throw new Error('Passwords has to match!!!');
      }
      return true;
  })]
,authController.postSignup);

Router.get('/admin/signup',authController.getSignUp);

Router.get('/admin/login',authController.getLogin);

Router.post('/login',
[body('email').isEmail().withMessage('please enter a valid email'),
body('password','password has to be valid').isLength({min:5}).
isAlphanumeric()]
,authController.postLogin)

Router.post('/logout',authController.logout);

Router.get('/reset',authController.getReset);

Router.post('/reset',
[body('email').isEmail().withMessage('please enter a valid email')],
authController.resetPost);

Router.get('/reset/:token',authController.getNewPassword);

Router.post('/new-password',
[body('password','password has to be valid').isLength({min:5}).
isAlphanumeric(), body('conPassword').custom((value,{req})=>{
  if(value!==req.body.password){
  throw new Error('Passwords has to match!!!');
  }
  return true;
})]
,authController.postNewPassword)

module.exports=Router;