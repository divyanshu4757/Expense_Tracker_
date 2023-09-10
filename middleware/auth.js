
const jwt = require('jsonwebtoken');
const signup_details = require('../models/userInfo.js');

const signup_table = signup_details.Signup_details;



exports.authenticate = (req,res,next)=>{

    const token = req.header('Authorization');
   // console.log('token sent' ,token);
    const user = jwt.verify(token ,'myToken');
   // console.log(user);
    const id= user.userId;


    signup_table.findByPk(id)
    .then(user=>{
        //console.log(user.dataValues);
        req.userId = user.dataValues.id;
        
        next();
    })
    .catch(err=>{
       res.status(401).json({message:"user not found"})
    })


}


