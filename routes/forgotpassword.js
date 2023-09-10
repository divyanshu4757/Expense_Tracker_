const express = require("express");
const router = express.Router();
const forgotController = require("../controllers/forgotpassword.js");

router.post("/password/forgotpassword", forgotController.forgotpassword);

router.get("/password/resetpassword/:id", forgotController.resetpassword);
router.get("/password/updatepassword/:id", forgotController.updatepassword);

module.exports = router;
