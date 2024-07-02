require("dotenv").config();
const { verify } = require("jsonwebtoken");
module.exports = {
  VerifyTokenApp: (req, res, next) => {
    let token = req.get("authorization");
    let resp;
    if (token) {
      token = token.slice(7);
      verify(token, process.env.AUTHORIZATION_APP_KEY, (err, decoded) => {
        if (err) {
          resp = {
            status: 401,
            error: true,
            title: "ຂໍອະໄພ",
            msg: "ໂທເຄັນຂອງທ່ານໝົດອາຍຸ",
          };
          return res.status(resp?.status).json(resp);
        } else if (!decoded?.result?.id) {
          resp = {
            status: 401,
            error: true,
            title: "ຂໍອະໄພ",
            msg: "ໂທເຄັນບໍ່ຖືກຕ້ອງ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່",
          };
          return res.status(resp?.status).json(resp);
        } else {
          req.userModel = decoded?.result;
          next();
        }
      });
    } else {
      resp = {
        status: 309,
        error: true,
        title: "ຂໍອະໄພ",
        msg: "ບໍ່ພົບ Token ທີ່ສົ່ງມາ",
      };
      return res.status(resp.status).json(resp);
    }
  },
  VerifyTokenAdmin: (req, res, next) => {
    let token = req.get("authorization");
    let resp;
    if (token) {
      token = token.slice(7);
      verify(
        token,
        process.env.AUTHORIZATION_BACKOFFICE_KEY,
        (err, decoded) => {
          if (err) {
            resp = {
              status: 401,
              error: true,
              title: "ຂໍອະໄພ",
              msg: "ໂທເຄັນຂອງທ່ານໝົດອາຍຸ",
            };
            return res.status(resp?.status).json(resp);
          } else if (!decoded?.result?.id) {
            resp = {
              status: 401,
              error: true,
              title: "ຂໍອະໄພ",
              msg: "ໂທເຄັນບໍ່ຖືກຕ້ອງ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່",
            };
            return res.status(resp?.status).json(resp);
          } else {
            delete decoded?.result?.password;

            req.userModel = decoded?.result;
            next();
          }
        }
      );
    } else {
      resp = {
        status: 309,
        error: true,
        title: "ຂໍອະໄພ",
        msg: "ບໍ່ພົບ Token ທີ່ສົ່ງມາ",
      };
      return res.status(resp.status).json(resp);
    }
  },
};
