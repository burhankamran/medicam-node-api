const Sequelize=require('sequelize');

const sequelize=require('../db/dbConnection');

const Admin=sequelize.define('admin',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },

});

module.exports=Admin;