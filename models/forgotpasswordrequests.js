


const Sequelize = require('sequelize');

const sequelschema= require('./userInfo.js');






const forgotpasswordrequests = sequelschema.sequelize.define('forgotpasswordrequests',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true,
        allowNull:false   
    },
  
    isactive:Sequelize.BOOLEAN,
    
})


module.exports = forgotpasswordrequests;

