require("dotenv").config();
const { useValidate } = require("validate-fields-body");
const { ExeQuery } = require("../../../service/excecute");
const fs = require("fs");
const path = require("path");
const imageDir = path.join(__dirname, "../../../public/images/profile/app/");
module.exports = {
  EditProfile: async (req, res) => {
    let resp;
    const validateKeys = [
      "!tel:string",
      "!name:string",
      "!surname:string",
      "!genderId:number",
    ];
    const [isValid, logs, result] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(309).json({
        status: 309,
        error: true,
        title: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        msg: logs,
      });
    }
    try {
      resp = await ExeQuery(`CALL user_app_edit_profile(?,?,?,?,?)`, [
        req.userModel.id,
        ...Object.values(result),
      ]);
      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
      };
    } catch (error) {
      resp = {
        status: 500,
        error: true,
        title: "Fail",
        msg: "ເກີດຂໍ້ຜິດພາດ",
      };
      console.log(error);
    } finally {
      return res.status(resp?.status || 500).send(resp);
    }
  },
  EditProfileImage: async (req, res) => {
    if (!req.file) {
      return res.status(309).json({
        status: 309,
        error: true,
        title: "require file",
        msg: "need image",
      });
    }
    let resp;
    let newfilename = req.file.filename;

    try {
      resp = await ExeQuery(`CALL user_app_edit_profile_image(?,?)`, [
        req.userModel?.id,
        newfilename,
      ]);

      if (resp[0][0]?.title === "success") {
        const current_filename = resp[1][0]?.file ?? "";
        if (current_filename != "") {
          const imagePath = path.join(imageDir, current_filename);
          if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error("Error deleting image:", err);
              } else {
                console.log("Image deleted successfully");
              }
            });
          }
        }
      }
      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
      };
    } catch (error) {
      resp = {
        status: 500,
        error: true,
        title: "Fail",
        msg: "ເກີດຂໍ້ຜິດພາດ",
      };
      console.log(error);
    } finally {
      return res.status(resp?.status || 500).send(resp);
    }
  },
};
