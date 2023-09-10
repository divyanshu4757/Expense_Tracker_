
const Sequelize = require('sequelize');

const sequelschema= require('./userInfo.js');





const downloads = sequelschema.sequelize.define('downloads',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true ,
        allowNull:false   
    },
    url:Sequelize.STRING,
    
})


module.exports = downloads;

