var express = require("express");
var router = express.Router();

const { View } = require("../../controller/app/first_aid/first_aid_controller");

router.get("/view", View);

module.exports = router;
