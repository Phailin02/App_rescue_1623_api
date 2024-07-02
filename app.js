var express = require("express");
var path = require("path");
require("dotenv").config();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const WebSocket = require("ws");
const { setLocalIpToEnv } = require("./service/getLocalIp");
setLocalIpToEnv();
var indexRouter = require("./routes/index");

var bAuthenRouter = require("./routes/backoffice/authen");
var bFirstAidRouter = require("./routes/backoffice/first_aid");
var bUnitRouter = require("./routes/backoffice/unit");
var bHospitalRouter = require("./routes/backoffice/hospital");
var bReportAccidentRouter = require("./routes/backoffice/report_accident");
var bUserBackofficeRouter = require("./routes/backoffice/user_backoffice");
var bUserAppRouter = require("./routes/backoffice/user_app");

var aAuthenRouter = require("./routes/app/authen");
var aFirstAidRouter = require("./routes/app/first_aid");
var aReportAccidentRouter = require("./routes/app/report_accident");
var aProfileRouter = require("./routes/app/profile");

var commonRouter = require("./routes/common");

var app = express();

const clients = [];

// WebSocket server connection handler
const server = new WebSocket.Server({ port: process.env.PORT_WEBSOCKET });
server.on("connection", (ws) => {
  console.log("New Client Connected");

  // Add the new client to the list
  clients.push(ws);

  // Message handler for each client
  ws.on("message", function incoming(message) {
    console.log("Received: %s", message);

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString("utf8"));
      }
    });
  });

  // Clean up disconnected clients
  ws.on("close", () => {
    console.log("Client Disconnected");
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("/backoffice/authen", bAuthenRouter);
app.use("/backoffice/firstaid", bFirstAidRouter);
app.use("/backoffice/unit", bUnitRouter);
app.use("/backoffice/hospital", bHospitalRouter);
app.use("/backoffice/reportaccident", bReportAccidentRouter);
app.use("/backoffice/userbackoffice", bUserBackofficeRouter);
app.use("/backoffice/userapp", bUserAppRouter);

app.use("/app/authen", aAuthenRouter);
app.use("/app/firstaid", aFirstAidRouter);
app.use("/app/reportaccident", aReportAccidentRouter);
app.use("/app/profile", aProfileRouter);

app.use("/backoffice/common", commonRouter);

app.use(function (req, res, next) {
  res.status(404).send({
    status: 404,
    error: true,
    title: "Path not found",
    msg: "please re-check path or method",
  });
});

module.exports = app;
