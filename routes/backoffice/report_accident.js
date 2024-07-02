var express = require("express");
var router = express.Router();

const { VerifyTokenAdmin } = require("../../middleware/verify");
const {
  ViewAccidentByStatusCase,
  UpdateAccidentStatus,
} = require("../../controller/backoffice/report_accident/report_accident_controller");

router.get(
  "/view/accidentbysttcase",
  VerifyTokenAdmin,
  ViewAccidentByStatusCase
);
router.put("/update/casestatus", VerifyTokenAdmin, UpdateAccidentStatus);
module.exports = router;
