const Sequelize=require('sequelize');
const sequlize = require('../db/dbConnection');


const cartItems=sequlize.define('cartItems',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true,
    },
    qty:{
        type:Sequelize.INTEGER
    }
});

module.exports=cartItems;
