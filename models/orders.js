
const Sequelize = require('sequelize');

const sequelschema= require('./userInfo.js');





const Order = sequelschema.sequelize.define('orders',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true ,
        allowNull:false   
    },
    paymentid:Sequelize.STRING,
    orderid:Sequelize.STRING,
    status:Sequelize.STRING,
})


module.exports = Order;
