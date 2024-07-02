require("dotenv").config();
const { useValidate } = require("validate-fields-body");
const { ExeQuery } = require("../../../service/excecute");
const { sign } = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { DecryptPassword } = require("../../../service/decrypt");

function compareStrings(plaintext, hashed) {
  const decryptedHash = CryptoJS.AES.decrypt(
    hashed,
    process.env.PASSWORD_KEY
  ).toString(CryptoJS.enc.Utf8);
  return plaintext === decryptedHash;
}
module.exports = {
  Login: async (req, res) => {
    // let a = EncryptData(result.password);
    // console.log(a);
    // return;
    let resp;
    const validateKeys = ["!tel:string", "!password:string"];
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
      let passwordDecrypt = await DecryptPassword(result?.password);

      if (passwordDecrypt?.title == "success") {
        resp = await ExeQuery(`CALL login(?)`, [result?.tel]);

        if (resp[0][0]?.title == "success") {
          const compare = compareStrings(
            passwordDecrypt?.password,
            resp[1][0]?.password
          );
          if (compare) {
            const jsontoken = sign(
              { result: resp[1][0] },
              process.env.AUTHORIZATION_APP_KEY,
              {
                expiresIn: "5h",
              }
            );
            const baseUrl = process.env.BASE_URL_IMG + "profile/app/";
            delete resp[1][0]?.password;
            delete resp[1][0]?.profile_img;
            resp[1][0]["access_token"] = jsontoken;
            resp[1][0].profile_image = baseUrl + resp[1][0].file;
            delete resp[1][0]?.file;

            resp = {
              status: 200,
              error: false,
              title: "success",
              msg: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
              resultData: resp[1][0],
            };
          } else {
            resp = {
              status: 500,
              error: true,
              title: "User Or Password Wrong",
              msg: "ລະຫັດຜ່ານ ຫຼື ຊື່ຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ",
            };
          }
        } else {
          resp = resp[0][0]?.msg ? resp[0][0] : resp;
        }
      } else {
        resp = passwordDecrypt;
      }
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
  Register: async (req, res) => {
    // let a = EncryptData(result.password);
    // console.log(a);
    // return;
    let resp;
    const validateKeys = [
      "!tel:string",
      "!name:string",
      "!surname:string",
      "!genderId:number",
      "!password:string",
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
      resp = await ExeQuery(`CALL register_user(?,?,?,?,?)`, [
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
};
