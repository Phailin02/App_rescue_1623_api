require("dotenv").config();
const CryptoJS = require("crypto-js");

async function DecryptPassword(data) {
  let resp;
  try {
    var bytes = CryptoJS.AES.decrypt(data, process.env.PASSWORD_KEY);
    var DecryptData = bytes.toString(CryptoJS.enc.Utf8);

    if (DecryptData?.length > 0) {
      resp = {
        status: 200,
        error: false,
        title: "success",
        msg: "Decrypt ສຳເລັດ",
        password: DecryptData,
      };
    } else {
      resp = {
        status: 500,
        error: true,
        title: " Fail",
        msg: "Password Wrong",
      };
    }
  } catch (error) {
    resp = {
      status: 500,
      error: true,
      title: "fail",
      msg: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
    };
  } finally {
    return resp;
  }
}
module.exports = { DecryptPassword };
