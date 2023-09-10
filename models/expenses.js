
const Sequelize = require('sequelize');

const sequelschema= require('./userInfo.js');





const expenses = sequelschema.sequelize.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true ,
        allowNull:false   
    },
    description:Sequelize.STRING,
    category:Sequelize.STRING,
    amount:Sequelize.INTEGER,
})


module.exports = expenses;

