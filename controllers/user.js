require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const signup_details = require("../models/userInfo.js");

const signup_table = signup_details.Signup_details;

const expense_table = require("../models/expenses.js");

const downloads = require("../models/downloads.js");
const Sequelize = require("../models/userInfo.js");
const sequelize = Sequelize.sequelize;

function uploadToS3(data, fileName, res, id) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
 
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET =process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  s3bucket.upload(params, (err, response) => {
    if (err) {
      console.log("something went wrong", err);
    } else {
      res.status(200).json({ fileURL: response.Location, success: true });
      downloads
        .create({
          url: response.Location,
          signupId: id,
        })
        .then((res) => console.log("success"))
        .catch((err) => console.log(err));
    }
  });
}

exports.download = async (req, res) => {
  try {
    const id = req.userId;
    console.log(id);

    const expenses = await expense_table.findAll({ where: { signupId: id } });

    const stringfiedExpenses = JSON.stringify(expenses);
    // console.log(stringfiedExpenses);

    //it should depend upon userId
    const fileName = `Expenses${id}/${new Date()}.txt`;
    uploadToS3(stringfiedExpenses, fileName, res, id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, error: err });
  }
};

function generateAccessToken(id) {
  const token = jwt.sign({ userId: id }, "myToken");
  return token;
}

exports.signUp = (req, res, next) => {
  const body = req.body;

  signup_table.findAll({ where: { email: req.body.email } }).then((result) => {
    if (result[0]) {
      res.json({ success: false });
    } else {
      bcrypt.hash(body.password, 10, (err, hash) => {
        signup_table
          .create({
            name: body.name,
            email: body.email,
            password: hash,
            isPremium: false,
          })
          .then((data) => {
            res.json({ success: true });
          });
      });
    }
  });
};

exports.login = (req, res, next) => {
  const body = req.body;

  signup_table.findAll({ where: { email: req.body.email } }).then((data) => {
    if (data[0]) {
      bcrypt.compare(
        req.body.password,
        data[0].dataValues.password,
        (err, response) => {
          // console.log(response);
          const id = data[0].dataValues.id;
          const token = generateAccessToken(id);

          if (err) {
            res.status(500).send("something went wrong");
          }

          if (response === true) {
            res.json({ id: token });
          } else if (response === false) {
            res.status(401).send("User not authorised");
          }
        }
      );
    } else {
      res.status(404).send("User not found");
    }
  });
};

exports.postExpenses = async (req, res, next) => {
  const t = await sequelize.transaction();
  const incomingData = req.body;
  const id = req.userId;
  //console.log(id)

  try {
    const serverData = await expense_table.create(
      {
        amount: incomingData.amount,
        category: incomingData.category,
        description: incomingData.description,
        signupId: id,
      },
      {
        transaction: t,
      }
    );

    const user = await signup_table.findOne({
      where: { id: req.userId },
      transaction: t,
    });
    //console.log(user);

    if (user) {
      await t.commit();
      user.expense = parseInt(user.expense) + parseInt(incomingData.amount);
      await user.save();

      res.json({ data: serverData.dataValues });
    } else {
      await t.rollback();
      return res.status(500).json({
        success: false,
        error: "User not found",
      });
    }
  } catch (err) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
};

exports.getExpenses = async (req, res, next) => {
  const userid = req.userId;
  console.log(userid);

  const page = parseInt(req.query.page);
  console.log(page);

  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  const totalCount = await expense_table.count({ where: { signupId: userid } });
  expense_table
    .findAll({ where: { signupId: userid }, offset: offset, limit: limit })
    .then((expenseResults) => {
      const pureExpenseResults = expenseResults.map((key) => key.dataValues);
      res.json({ pureResult: pureExpenseResults, count: totalCount });
    })
    .catch((error) => {
      console.log(error);
      res.send("error aagyi bhai");
    });
};


exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const userid = req.userId;
  console.log(userid);

  const t = await sequelize.transaction();

  try {
    const expense = await expense_table.findOne({
      where: { id: id },
      transaction: t,
    });
    const user = await signup_table.findOne({
      where: { id: userid },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    user.expense -= expense.amount;
    await user.save({ transaction: t });

    await expense_table.destroy({
      where: { id: id, signupId: userid },
      transaction: t,
    });

    await t.commit();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};

exports.previousdownloads = (req, res, next) => {
  const id = req.userId;

  downloads.findAll({ where: { signupId: id } }).then((response) => {
    res.json({ response });
  });
};
