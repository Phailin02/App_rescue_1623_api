require("dotenv").config();
const { useValidate } = require("validate-fields-body");
const { ExeQuery } = require("../../../service/excecute");
const fs = require("fs");
const path = require("path");
const imageDir = path.join(__dirname, "../../../public/images/first_aid/");
module.exports = {
  View: async (req, res) => {
    let resp;
    let { search, page, limit } = req.query;
    if (!page && !limit) {
      limit = -1;
    }
    if (page && !limit) {
      limit = 15;
    }
    let start = parseInt((page || 1) * limit) - parseInt(limit);
    const baseUrl = process.env.BASE_URL_IMG + "first_aid/";
    try {
      resp = await ExeQuery(`CALL first_aid_view(?,?,?)`, [
        search || "",
        start,
        limit,
      ]);
      if (resp[1] && resp[0][0]?.title == "success") {
        for (let index = 0; index < resp[1].length; index++) {
          if (resp[1][index]?.file) {
            const filename = resp[1][index]?.file;
            resp[1][index].file = baseUrl + filename;
          }
        }
      }
      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
        count_page:
          resp[0][0]?.title == "success"
            ? limit == -1
              ? 1
              : resp[2]
              ? Math.ceil(Number(resp[2][0]?.count_data) / limit)
              : 0
            : 0,
        resultData: resp[0][0]?.title == "success" ? resp[1] : [],
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
  Create: async (req, res) => {
    let resp;
    let filename = "";
    if (req.file) {
      filename = req.file.filename;
    }

    const validateKeys = ["!title", "!describe"];
    const [isValid, logs, body] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(309).json({
        status: 309,
        error: true,
        title: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        msg: logs,
      });
    }

    try {
      resp = await ExeQuery(`CALL first_aid_insert(?,?,?,?)`, [
        ...Object.values(body),
        filename,
        req.userModel?.id,
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
  Delete: async (req, res) => {
    let resp;
    const validateKeys = ["!id"];
    const [isValid, logs, body] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(309).json({
        status: 309,
        error: true,
        title: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        msg: logs,
      });
    }

    try {
      resp = await ExeQuery(`CALL first_aid_delete(?,?)`, [
        body.id,
        req.userModel?.id,
      ]);

      if (resp[0][0]?.title === "success") {
        const filename = resp[1][0]?.file ?? "";
        if (filename != "") {
          const imagePath = path.join(imageDir, filename);

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
  Update: async (req, res) => {
    const validateKeys = ["!id", "!title", "!describe"];
    const [isValid, logs, body] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(309).json({
        status: 309,
        error: true,
        title: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        msg: logs,
      });
    }

    let resp;
    let newfilename = "";
    if (req.file) {
      newfilename = req.file.filename;
    }

    try {
      resp = await ExeQuery(`CALL first_aid_update(?,?,?,?,?)`, [
        ...Object.values(body),
        newfilename,
        req.userModel?.id,
      ]);

      if (resp[0][0]?.title === "success") {
        const current_filename = resp[1][0]?.file ?? "";
        if (current_filename != "" && req.file) {
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
