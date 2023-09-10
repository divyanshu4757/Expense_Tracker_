require("dotenv").config();

const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_NAME , process.env.DATABASE_USERNAME ,process.env.DATABASE_PASSWORD ,{dialect:'mysql' , host:process.env.DATABASE_HOST});

const Signup_details = sequelize.define('signup',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true ,
        allowNull:false   
    },
    name:Sequelize.STRING,
    email:Sequelize.STRING,
    password:Sequelize.STRING,
    isPremium:Sequelize.BOOLEAN,
    expense:Sequelize.INTEGER
})


module.exports ={sequelize: sequelize,
  
Signup_details:Signup_details,

}
