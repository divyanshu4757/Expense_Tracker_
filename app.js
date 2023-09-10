const express = require("express");

const app = express();
const fs= require("fs");
const path = require("path");

const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes/routes.js");
const premiumRoutes = require("./routes/premiumRoutes.js");
const forgotRoutes = require("./routes/forgotpassword.js");
const Sequelize = require("./models/userInfo.js");
const signup_details = require("./models/userInfo.js");

const signup_table = signup_details.Signup_details;

const expense_table = require("./models/expenses.js");
const order_table = require("./models/orders.js");
const downloads_table = require("./models/downloads.js");
const forgot_password_table = require("./models/forgotpasswordrequests");
const helmet = require('helmet')
const morgan = require('morgan');
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

// app.use(
//   helmet()
// );


app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' cdnjs.cloudflare.com checkout.razorpay.com code.jquery.com cdn.jsdelivr.net stackpath.bootstrapcdn.com maxcdn.bootstrapcdn.com  'nonce-${nonce}';`
  );
  next();
});


app.use(morgan('combined',{stream:accessLogStream}));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);
app.use(premiumRoutes);
app.use(forgotRoutes);

app.use((req,res,next)=>{
console.log('urllll' , req.url)
  res.sendFile(path.join(__dirname,`frontend/${req.url}`),);
})

signup_table.hasMany(expense_table);
expense_table.belongsTo(signup_table);

signup_table.hasMany(order_table);
order_table.belongsTo(signup_table);

signup_table.hasMany(downloads_table);
downloads_table.belongsTo(signup_table);

signup_table.hasMany(forgot_password_table);
forgot_password_table.belongsTo(signup_table);

Sequelize.sequelize
  .sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
