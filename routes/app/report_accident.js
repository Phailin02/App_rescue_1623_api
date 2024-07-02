var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../public/images/accident/");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      "report-accident-" + Date.now() + Math.floor(Math.random() * 1000);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.send({
      status: 400,
      error: true,
      title: "fail",
      msg: "fail to upload file",
    });
  }
}
const { VerifyTokenApp } = require("../../middleware/verify");
const {
  UserReportAccident,
  RescueViewListAccidentNotAcceptYet,
  RescueAcceptCase,
  RescueViewHistory,
  UserViewHistory,
  InsertCaseInfo,
} = require("../../controller/app/report_accident/report_accident_controller");

router.post("/rescue/insert/caseinfo", VerifyTokenApp, InsertCaseInfo);
router.post(
  "/sendreportaccident",
  VerifyTokenApp,
  errHandler,
  upload.single("file"),
  UserReportAccident
);

router.post("/rescue/acceptcase", VerifyTokenApp, RescueAcceptCase);
router.get(
  "/rescue/listaccident",
  VerifyTokenApp,
  RescueViewListAccidentNotAcceptYet
);
router.get("/rescue/history", VerifyTokenApp, RescueViewHistory);
router.get("/view/reporthistory", VerifyTokenApp, UserViewHistory);
module.exports = router;
