var express = require("express");
var router = express.Router();
const { VerifyTokenApp } = require("../../middleware/verify");

const {
  Login,
  Register,
  EditProfile,
} = require("../../controller/app/authen/authen_controller");

router.post("/login", Login);
router.post("/register", Register);

module.exports = router;
