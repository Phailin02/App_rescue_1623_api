var express = require("express");
var router = express.Router();

const { VerifyTokenAdmin } = require("../../middleware/verify");
const {
  View,
  Create,
  Delete,
  Update,
  ChangePass,
} = require("../../controller/backoffice/user_backoffice/user_backoffice_controller");

router.get("/view", VerifyTokenAdmin, View);
router.post("/create", VerifyTokenAdmin, Create);
router.delete("/delete", VerifyTokenAdmin, Delete);
router.put("/update", VerifyTokenAdmin, Update);
router.put("/changepass", VerifyTokenAdmin, ChangePass);

module.exports = router;
