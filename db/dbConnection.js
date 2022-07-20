const Sequelize=require('sequelize');

const sequlize=new Sequelize('medicam','root','kips12345',
{dialect:'mysql',host:'localhost'
});

module.exports=sequlize;