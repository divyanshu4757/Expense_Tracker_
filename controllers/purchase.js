require("dotenv").config();


const Razorpay = require("razorpay");
const Order = require("../models/orders");
const signup_details = require("../models/userInfo.js");
const signup_table = signup_details.Signup_details;


exports.purchasepremium = async (req, res) => {
  //   console.log(req.userId);

  var rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const amount = 25000;

  rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
    // console.log(order);
    if (err) {
      res.status(403).json({ message: "something went wrong", error: true });
    }

    Order.create({
      orderid: order.id,
      status: "pending",
      signupId: req.userId,
    })
      .then((result) => {
        return res.status(200).json({ result, key_id: rzp.key_id });
      })
      .catch((err) => {
        res.status(403).json({ message: "something went wrong", error: true });
      });
  });
};

exports.transactionstatus = (req, res) => {
  console.log(req.userId);

  const { payment_id, order_id } = req.body;
  console.log(payment_id);

  const orderPromise = Order.findOne({ where: { orderid: order_id } }).then(
    (order) => {
      order.paymentid = payment_id;
      order.status = "confirmed";
      return order.save();
    }
  );

  const userPromise = signup_table
    .findOne({ where: { id: req.userId } })
    .then((user) => {
      user.isPremium = true;
      return user.save();
    });

  Promise.all([orderPromise, userPromise])
    .then(() => {
      res
        .status(202)
        .json({ success: true, message: "Transaction Successful" });
    })
    .catch((err) => {
      res.status(403).json({ message: "Something went wrong", error: true });
    });
};



