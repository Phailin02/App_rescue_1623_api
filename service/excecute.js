require("dotenv").config();
var conn = require("../db");
function ExeQuery(sql, parmeter) {
  return new Promise((res) => {
    let resp;
    conn.query(sql, parmeter, async function (err, rs) {
      if (err) {
        console.log(err);
        resp = {
          status: 500,
          error: true,
          title: "ຂໍອະໄພ",
          msg: "Query ຜິດພາດ",
        };
        res(resp);
      } else if (rs[0]?.length > 0) {
        resp = rs;

        res(resp);
      } else {
        // console.log(rs);
        resp = {
          status: 401,
          error: true,
          title: "ຂໍອະໄພ",
          msg: "DB No Response",
        };
        res(resp);
      }
    });
  });
}
module.exports = { ExeQuery };
