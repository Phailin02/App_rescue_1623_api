require("dotenv").config();
const { useValidate } = require("validate-fields-body");
const { ExeQuery } = require("../../../service/excecute");

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

    try {
      resp = await ExeQuery(`CALL user_app_view(?,?,?,?)`, [
        "%" + (search || "") + "%",
        start,
        limit,
        req.userModel?.id,
      ]);

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
    const validateKeys = [
      "!user_type_id",
      "unit_id",
      "!tel",
      "!uname",
      "!usurname",
      "!gender_id",
      "!pass",
    ];

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
      resp = await ExeQuery(`CALL user_app_insert(?,?,?,?,?,?,?,?)`, [
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
      resp = await ExeQuery(`CALL user_app_delete(?,?)`, [
        body.id,
        req.userModel?.id,
      ]);

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
  ChangePass: async (req, res) => {
    let resp;
    const validateKeys = ["!id", "!newpass"];
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
      resp = await ExeQuery(`CALL user_app_change_pass(?,?,?)`, [
        ...Object.values(body),
        req.userModel?.id,
      ]);

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
    let resp;
    const validateKeys = [
      "!id",
      "!user_type_id",
      "unit_id",
      "!tel",
      "!uname",
      "!usurname",
      "!gender_id",
    ];
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
      resp = await ExeQuery(`CALL user_app_update(?,?,?,?,?,?,?,?)`, [
        ...Object.values(body),
        req.userModel?.id,
      ]);

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
