const Sequelize=require('sequelize');
const sequelize=require('../db/dbConnection');

const Product=sequelize.define('product',{
   
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },

    title:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    imageUrl1:{
        type:Sequelize.STRING,
        allowNull:false,
    }
    ,
    imageUrl2:{
        type:Sequelize.STRING,
        allowNull:true,
    }
    ,
    imageUrl3:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    }

});

module.exports=Product;