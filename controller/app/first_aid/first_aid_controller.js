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
        status: resp[0][0]?.status || 500,
        error: resp[0][0]?.error || true,
        msg: resp[0][0]?.msg || "Fail",
        title: resp[0][0]?.title || "ຂໍອະໄພ",
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
};
