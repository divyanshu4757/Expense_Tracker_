const signup_details = require("../models/userInfo.js");
const signup_table = signup_details.Signup_details;
const expense_table = require("../models/expenses.js");

const sequelize = require("sequelize");

exports.leaderboard = async (req, res) => {
  try {
   
    const user = await signup_table.findOne({ where: { id: req.userId } });

    if (user.isPremium === false) {
      res.json({ isPremium: false, message: "user is not a premium" });
      return;
    }
 
 signup_table.findAll({
      attributes: [
        "name",
        "expense",
       
      ]})
      .then(result=>{
       
        
    res.status(200).json(result);

      })

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};


