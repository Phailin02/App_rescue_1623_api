const WebSocket = require("ws");

let wss;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

function getWebSocketServer() {
  return wss;
}

module.exports = { setupWebSocket, getWebSocketServer };
