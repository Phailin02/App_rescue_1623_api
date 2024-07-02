require("dotenv").config();
const { useValidate } = require("validate-fields-body");
const { ExeQuery } = require("../../../service/excecute");
const fs = require("fs");
const path = require("path");
const imageDir = path.join(__dirname, "../../../public/images/accident/");
module.exports = {
  ViewAccidentByStatusCase: async (req, res) => {
    let resp;
    let { stt_case_id, page, limit } = req.query;
    if (!page && !limit) {
      limit = -1;
    }
    if (page && !limit) {
      limit = 15;
    }
    let start = parseInt((page || 1) * limit) - parseInt(limit);
    const baseUrl = process.env.BASE_URL_IMG + "accident/";
    try {
      resp = await ExeQuery(`CALL case_view_by_stt(?,?,?)`, [
        stt_case_id || "all",
        start,
        limit,
      ]);
      if (resp[1] && resp[0][0]?.title == "success") {
        resp[1].map((x) => {
          for (let key in x) {
            x[key] = JSON.parse(x[key]);
            if (key == "case_info") {
              let filename = x[key].file_name;
              x[key].file_name = baseUrl + filename;
            }
          }
        });
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
  UpdateAccidentStatus: async (req, res) => {
    let resp;
    const validateKeys = ["!case_id", "!stt_case_id"];
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
      resp = await ExeQuery(`CALL update_status_case(?,?,?)`, [
        ...Object.values(body),
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
};
