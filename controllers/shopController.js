const Product = require("../models/Product");

const stripe=require('stripe')('sk_test_51JK4DZBtV3MZSR8Ck1FTWliXwYBBSRV1sRgVbcw2D6rbStrQzYnHnQKeul5zhsdxsWyuj2nW5LkjKOfEYzQl1MPC00Fb4WJ3fG');
//const PdfDocument=require('pdfkit');
//const Order=require('../models/Order');
const path=require('path');
const fs=require('fs');

const Items_Per_Page=3;

exports.getIndex=(req,res,next)=>{
  const page=+req.query.page ||1; 
   let totalProducts=0; 
   Product.count().then(numberOfProducts=>{
     totalProducts=numberOfProducts;
   return Product.findAll({offset:(page-1)*Items_Per_Page,limit:Items_Per_Page})
    
   })
   .then(products=>{
    res.render('shop/index',
  {pageTitle:'Shop',prods:products,path:'/products',
  currentPage:page,
  hasNextPage:Items_Per_Page*page < totalProducts,
  hasPreviousPage:page>1,
  previousPage:page-1,
  nextPage:page+1,
  lastPage:Math.ceil(totalProducts/Items_Per_Page),
  csrfToken:'dkff'});
  })
    .catch(err=>console.log(err));
     
 }

exports.moveToGetIndex=(req,res)=>{
    res.redirect('/index');
}

 exports.getIndexCategory=(req,res,next)=>{
  const page=+req.query.page ||1; 
   let totalProducts=0; 
   const category=req.params.category;
   Product.count().then(numberOfProducts=>{
     totalProducts=numberOfProducts;
   return Product.findAll({offset:(page-1)*Items_Per_Page,limit:Items_Per_Page,
    where:{category:category}})
    
   })
   .then(products=>{
    res.render('shop/index',
  {pageTitle:'Shop',prods:products,path:'/products',
  currentPage:page,
  hasNextPage:Items_Per_Page*page < totalProducts,
  hasPreviousPage:page>1,
  previousPage:page-1,
  nextPage:page+1,
  lastPage:Math.ceil(totalProducts/Items_Per_Page),
  csrfToken:'dkfd'});
  })
    .catch(err=>console.log(err));
     
 }

exports.getProduct=(req,res)=>{
   const prodId= req.params.id;
   Product.findByPk(prodId)
   .then(product=>{
     res.render('shop/prod-detail',{
      product:product,path:'/',pageTitle:'Detail'});
   })
   .catch(err=>console.log(err));
}

exports.postCart=(req,res)=>{
    const prodId=req.body.productId;
    let fetchedCart;
    let newQuantity=1;
     req.user.getCart()
     .then(cart=>{
       console.log(cart)
      fetchedCart=cart;
       return cart.getProducts({where:{id:prodId}});
     })
     .then((products)=>{
       let product;
      if(products.length>0)
      {
        product=products[0];
      }
        
        if(product)
        {
           const oldQuantity=product.cartItems.qty;
           newQuantity=oldQuantity+1;
            return product;
        }
      return  Product.findByPk(prodId)
  
     })
     .then(product=>{
      return  fetchedCart.addProduct(product,{through:{qty:newQuantity}});
      })
     .then(()=>{
        res.redirect('/cart');
     })
     .catch(err=>console.log(err));
  
  }


  exports.cart=(req,res,next)=>{
    let totalPrice=0;
    let productAll;
    req.user.getCart()
    .then(cart=>{
     return cart.getProducts()
      .then(products=>{
        productAll=products;
        if(products.length<0)
        {
          return  res.render('shop/cart',
         {path:'/cart',pageTitle:'Cart',cartData:productAll,
         totalPrice:totalPrice});
        }
        else
       {
        
        products.forEach(prod=>totalPrice+=prod.cartItems.qty * prod.price);

       return stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:productAll.map(p=>{
         return {
           name:p.title,
           description:p.description,
           amount:p.price *100,
           currency:'usd',
           quantity:p.cartItems.qty,
         }
        }),   
        success_url: req.protocol + '://' + req.get('host') +'/checkout/success',
        cancel_url:req.protocol + '://' + req.get('host') +'/checkout/cancel' 
       });
        }
      })
      .then(session=>{
        res.render('shop/cart',
        {path:'/cart',pageTitle:'Cart',cartData:productAll,
        totalPrice:totalPrice,sessionId:session.id});
      })
      .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err))
  
 }

 exports.postCartDelete=(req,res)=>{
   let cartFetched;
   let totalPrice=0;
   let lenghtProducts=0;
  const prodId=req.params.productId;

  req.user.getCart()
  .then(cart=>{
    cartFetched=cart;
    return cart.getProducts({where:{id:prodId}});
  })
  .then(products=>{
      const product=products[0];
     return product.cartItems.destroy();
  })
  .then(()=>{
   return cartFetched.getProducts();
  })
  .then(products=>{
    products.forEach(prod=>totalPrice+=prod.cartItems.qty * prod.price);
    res.status(200).json({
      message:'done',
      totalPrice:totalPrice,
      productsLength:products.length,
    })
  })
  .catch(err=>console.log(err));

}



