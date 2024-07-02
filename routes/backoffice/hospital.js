var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../public/images/hospital/");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      "hospital-" + Date.now() + Math.floor(Math.random() * 1000);
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
const { VerifyTokenAdmin } = require("../../middleware/verify");
const {
  View,
  Create,
  Delete,
  Update,
} = require("../../controller/backoffice/hospital/hospital_controller");

router.get("/view", View);
router.delete("/delete", VerifyTokenAdmin, Delete);
router.post(
  "/create",
  VerifyTokenAdmin,
  errHandler,
  upload.single("file"),
  Create
);
router.put(
  "/update",
  VerifyTokenAdmin,
  errHandler,
  upload.single("file"),
  Update
);

module.exports = router;
