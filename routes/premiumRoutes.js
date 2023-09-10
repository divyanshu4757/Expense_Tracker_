const express = require("express");
const router = express.Router();


const authentication = require("../middleware/auth.js");
const premiumController = require("../controllers/premium.js");


router.get("/premium/leaderboard",authentication.authenticate, premiumController.leaderboard);
module.exports = router;