var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../public/images/profile/app/");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      "profile-" + Date.now() + Math.floor(Math.random() * 1000);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
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
  EditProfile,
  EditProfileImage,
} = require("../../controller/app/profile/profile_controller");

router.put("/edit/info", VerifyTokenApp, EditProfile);
router.put(
  "/edit/image",
  VerifyTokenApp,
  errHandler,
  upload.single("file"),
  EditProfileImage
);

module.exports = router;
