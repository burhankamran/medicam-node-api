const Product = require("../models/Product");

const { validationResult }=require('express-validator');

exports.getAddProduct=(req,res)=>{
    res.render('admin/add_edit_product',{pageTitle:'Add Products',
    oldInputs:{title:'',price:null,desription:''},
    path:'/admin/add-product',editing:false,
    errorMessage:'',valiationErrors:[]});
}

exports.postAddProduct=(req,res)=>{
    console.log('hy');
    const title=req.body.title;
    const image=req.files;
    const price=req.body.price;
    const description=req.body.description;
    const category=req.body.category;
    const errors=validationResult(req);
    if(!image)
    {
      return  res.render('admin/add_edit_product',
      {pageTitle:'Add Products',path:'',editing:false,
        oldInputs:{title:'',image:null,price:null,desription:''},
        errorMessage:'Attach file is not image',valiationErrors:[]});
    }

    if(!errors.isEmpty())
    {
      return  res.render('admin/add_edit_product',
      {pageTitle:'Add Products',path:'',editing:false,
      oldInputs:{title:title,image:'',price:price,desription:description},
      errorMessage:errors.array()[0].msg,valiationErrors:[]});
    }
    const imageUrl1=image.image[0].path;
    let imageUrl2=null;
    let imageUrl3=null;
    if(image.image2)
    {
      imageUrl2=image.image2[0].path;
    }
    if(image.image3)
    {
      imageUrl3=image.image3[0].path; 
    }
    

    req.user.createProduct({
        title:title,
        price:price,
        category:category,
        description:description,
        imageUrl1:imageUrl1,
        imageUrl2:imageUrl2,
        imageUrl3:imageUrl3,
    })
    .then(results=>{
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
   
}

