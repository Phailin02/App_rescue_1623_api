require("dotenv").config();
const CryptoJS = require("crypto-js");

async function EncryptData(password) {
  let resp;
  try {
    // Encrypt
    var dataEncrypt = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_KEY
    ).toString();

    resp = {
      status: 500,
      error: true,
      title: "fail",
      msg: "ການເຂົ້າລະຫັດບໍ່ຖືກຕ້ອງ",
      resultData: dataEncrypt,
    };
  } catch (error) {
    console.log(error);
    resp = {
      status: 500,
      error: true,
      title: "fail",
      msg: "ການເຂົ້າລະຫັດບໍ່ຖືກຕ້ອງ",
    };
  } finally {
    return resp;
  }
}
module.exports = { EncryptData };
