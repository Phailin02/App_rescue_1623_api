var express = require("express");
var router = express.Router();

const {
  Login,
} = require("../../controller/backoffice/authen/authen_controller");

router.post("/login", Login);

module.exports = router;
