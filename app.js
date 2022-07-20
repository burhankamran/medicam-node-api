const express=require('express');
const bodyParser=require('body-parser');
const  session = require('express-session')
const multer=require('multer');
const path=require('path');
const csurf=require('csurf');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const fs=require('fs');
const https=require('https');

const Product=require('./models/Product');
const authRoutes=require('./Routes/authRoutes');
const sequelize=require('./db/dbConnection');
const User=require('./models/User');
const MySQLStore = require('express-mysql-session')(session);
const shopRoutes=require('./Routes/shopRoutes');
const Cart=require('./models/Cart');
const CartItems=require('./models/cart-item');
const Admin=require('./Models/Admin');
const adminRoutes=require('./Routes/adminRoutes');
const adminAuth=require('./Routes/adminAuthRoutes')

const app=express();


const options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'kips12345',
	database: 'medicam'
};
const sessionStore = new MySQLStore(options);

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
         cb(null,'images'); 
    },
    filename:(req,file,cb)=>{
       cb(null,file.originalname+req.body.title)
    }
    
});

const fileFilter=(req,file,cb)=>{

    if(file.mimetype==='image/png'||
       file.mimetype==='image/jpg'||
       file.mimetype==='image/jpeg')
    {
       return cb(null,true);
    }
   
    cb(null,false);
}

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'image2', maxCount: 1 },
	{ name: 'image3', maxCount: 1 }
  ]));



app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','ejs');
app.set('views','views')




app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));


app.use(
    session({secret:'my secret',resave:false,saveUninitialized:false,
    store: sessionStore,})
       );
	   //const csurfprotection=csurf();
	   //app.use(csurfprotection);  
	  
	   app.use((req,res,next)=>{
		if(!req.session.user)
		{
			return next();
		}
		Admin.findByPk(req.session.user.id)
		.then(user=>{
			if(!user)
			{
				return next();
			}
			req.user=user;
			next();
		})
		.catch(err=>
			{
			throw new Error(err)
			//next();
		});
	});

	app.use((req, res,next)=>{
		//console.log(req.csrfToken());
		res.locals.isAuthenticated=req.session.isLoggedIn;
		res.locals.csrfToken='jkj';
		next();
	});

app.use(adminAuth);	

app.use(adminRoutes);

app.use(authRoutes);

app.use(shopRoutes);

//one to one
User.hasOne(Cart);
Cart.belongsTo(User); 

// Many to Many relationship
Product.belongsToMany(Cart,{through:CartItems});
Cart.belongsToMany(Product,{through:CartItems});

Product.belongsTo(Admin,{constraints:true,onDelete:'CASCADE'});
Admin.hasMany(Product);

sequelize.sync()
.then((results)=>{
    //https.createServer({key:privateKey,cert:certificate},app)
	app.listen(3000);
})
.catch(err=>console.log(err));