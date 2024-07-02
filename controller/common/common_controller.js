require("dotenv").config();

const { ExeQuery } = require("../../service/excecute");

module.exports = {
  ProvinceView: async (req, res) => {
    let resp;
    try {
      resp = await ExeQuery(`CALL province_view()`);
      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
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
  DistrictViewByProvinceId: async (req, res) => {
    let resp;
    let { provinceId } = req.params;
    try {
      resp = await ExeQuery(`CALL district_view_by_province_id(?)`, [
        provinceId,
      ]);
      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
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
  VillageViewByDistrictId: async (req, res) => {
    let resp;
    let { districtId } = req.params;
    try {
      resp = await ExeQuery(`CALL village_view_by_district_id(?)`, [
        districtId,
      ]);
      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
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
  Dropdown: async (req, res) => {
    let resp;

    try {
      resp = await ExeQuery(`CALL dropdown()`);

      let myResData = {
        user_type: resp[1],
        gender: resp[2],
        case_status: resp[3],
        unit: resp[4],
        hospital: resp[5],
        case_type: resp[6],
        case_type_detail: resp[7],
      };

      resp = {
        status: resp[0][0]?.status ? resp[0][0]?.status : 500,
        error: resp[0][0]?.error ? resp[0][0]?.error : "true",
        msg: resp[0][0]?.msg ? resp[0][0]?.msg : "Fail",
        title: resp[0][0]?.title ? resp[0][0]?.title : "ຂໍອະໄພ",
        resultData: myResData,
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
