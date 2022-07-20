const bcrypt=require('bcrypt');
const { validationResult }=require('express-validator/check');

const crypto=require('crypto');
const  nodemailer = require('nodemailer');

const transpoter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'2k18bscs228@undergrad.nfciet.edu.pk',
      pass:'kips12345'

    }
})
 NODE_TLS_REJECT_UNAUTHORIZED=0
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const User = require('../models/User');
const Admin = require('../Models/admin');

exports.postSignup=(req,res)=>{
    
    const email=req.body.email;
    const password=req.body.password;
    const conPassword=req.body.conPassword;
    const error=validationResult(req);

    if(!error.isEmpty())
    {
      return  res.status(422).render('admin/auth/signup',
        {pageTitle:'SignUp Admin',valiationErrors:error.array(),
         errorMessage:error.array()[0].msg,path:'/admin/signup',
        oldInputs:{email:email,password:password,conPassword:conPassword}});
    }

    bcrypt.hash(password,12)
    .then(hashedPassword=>{
      return  Admin.create(
            {
                email:email,
                password:hashedPassword,
            }
        );
    })
     .then(results=>{
         res.redirect('/admin/login');
     })
    .catch(err=>console.log(err));
}

exports.getSignUp=(req,res)=>{
    
     res.render('admin/auth/signup',{pageTitle:'SignUp Admin',
     path:'/admin/signup',
     oldInputs:{email:'',password:'',conPassword:''},
     errorMessage:'',valiationErrors:[]});
}

exports.getLogin=(req,res)=>{
    res.render('admin/auth/login',{pageTitle:'Login Admin',path:'/signup',
       oldInputs:{email:'',password:''},errorMessage:'',path:'/login',
       valiationErrors:[]});
}

exports.postLogin=(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    let userSaved;
    const errors= validationResult(req);

    if(!errors.isEmpty())
    {
        return res.render('admin/auth/login',{pageTitle:'Login',
       oldInputs:{email:email,password:password},path:'/login',
       errorMessage:errors.array()[0].msg,
       valiationErrors:errors.array()});
    }

    Admin.findOne({where:{email:email}})
    .then(user=>{
        if(!user)
        {
           return res.status(422).render('auth/login',{pageTitle:'Login Admin',
       oldInputs:{email:email,password:password},path:'/admin/login',
       errorMessage:'Invalid email or password ',valiationErrors:[]});
      
        }
        else
        {
        userSaved=user;
       return bcrypt.compare(password,user.password) }
    })
    .then(doMatch=>{
        if(!doMatch)
        {
           return res.status(422).render('auth/login',{pageTitle:'Login Admin',
            oldInputs:{email:email,password:password},path:'/admin/login',
            errorMessage:'Invalid email or password ',valiationErrors:[]});
        }
            else { req.session.isLoggedIn=true;
             req.session.user=userSaved;
            
             return req.session.save(err=>{
               console.log(err);
               res.redirect('/admin/add-product');
             })
            }
    })
    .catch(err=>console.log(err));
}

exports.logout=(req,res)=>{
 
    req.session.destroy((err)=>{
      console.log(err);
      res.redirect('/index');
    });
  }

exports.getReset=(req,res)=>{
    res.render('auth/reset_password',{pageTitle:'Reset Password',path:'/reset',
    oldInputs:{email:'',password:''},errorMessage:'',
    valiationErrors:[]});
  }




exports.resetPost=(req,res)=>{
  const errors= validationResult(req);

  if(!errors.isEmpty())
  {
      return res.render('auth/reset_password',{pageTitle:'Reset Password',
     oldInputs:{email:req.body.email},path:'/reset',
     errorMessage:errors.array()[0].msg,
     valiationErrors:errors.array()});
  }
    crypto.randomBytes(32,(error,buffer)=>{
      if(error)
      {
        res.render('auth/reset_password',{pageTitle:'Reset Password',path:'/reset',
        oldInputs:{email:''},errorMessage:'An Error Occured',
        valiationErrors:[]});
      }
      //convert normal hex value to ASCI
      const token=buffer.toString('hex');
      User.findAll({where:{email:req.body.email}})
      .then(user=>{
        
        if(user.length<=0)
        {
          return  res.render('auth/reset_password',{pageTitle:'Reset Password',path:'/reset',
         oldInputs:{email:''},errorMessage:'No User Found',
          valiationErrors:[]});
        }
        else{
        user[0].resetToken=token;
        user[0].resetTokenExpiration=Date.now() + 3600000;
        return user[0].save();
        }
      })
      .then(results=>{
        res.redirect('/index');
        transpoter.sendMail({
          from:'2k18bscs228@undergrad.nfciet.edu.pk',
           to:req.body.email,
           subject:"Password Reset",
           html:`<p> You requested a password Reset  </p>
            <p>Click this link <a href="http://localhost:3000/reset/${token}">link</a>  to reset password`
           
        },(err,data)=>{
          if(err)
          {
            console.log(err);
          }
        });
      })
      .catch(err=>console.log(err));
    });
}


exports.getNewPassword=(req,res)=>{

    const token=req.params.token;

    User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
      res.render('auth/new_Password',
      {path:'/new_password',pageTitle:'New Password',
      errorMessage:'',
      user_Id:user.id.toString(),
      passwordToken:token,
    });
    })
    .catch(err=>console.log(err));

 
}

exports.postNewPassword=(req,res)=>{
  let resetUser;
     const newPassword=req.body.password;
     const userId=req.body.userId;
     const passwordToken=req.body.passwordToken;
     const errors= validationResult(req);

     if(!errors.isEmpty())
     {
         return res.render('auth/new_Password',{pageTitle:'New Password',
        oldInputs:{password:req.body.password,conPassword:req.body.conPassword}
        ,path:'/reset',user_Id:userId,passwordToken:passwordToken,
        errorMessage:errors.array()[0].msg,
        valiationErrors:errors.array()});
     }
     User.findOne({resetToken:passwordToken,
      resetTokenExpiration:{$gt:Date.now()},id:userId})
      .then(user=>{
        resetUser=user;
       return bcrypt.hash(newPassword,12);
      })
      .then(hashPassword=>{
         resetUser.password=hashPassword;
         resetUser.resetToken=null;
         resetUser.resetTokenExpiration=null;
         return resetUser.save();
      })
      .then(result=>{
         res.redirect('/login');
      })
      .catch(err=>console.log(err));
}