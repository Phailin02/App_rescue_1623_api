const os = require("os");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

function updateEnv(key, value) {
  const envPath = path.resolve(__dirname, "../.env");
  let envConfig = {};

  if (fs.existsSync(envPath)) {
    const envFileContent = fs.readFileSync(envPath, "utf8");
    envConfig = dotenv.parse(envFileContent);
  }

  envConfig[key] = value;

  const newEnvFileContent = Object.keys(envConfig)
    .map((k) => `${k}=${envConfig[k]}`)
    .join("\n");

  fs.writeFileSync(envPath, newEnvFileContent);
}

function setLocalIpToEnv() {
  const localIp = getLocalIpAddress();
  if (localIp) {
    updateEnv("BASE_URL_IMG", `'http://${localIp}:8081/images/'`);
  }
}

module.exports = {
  getLocalIpAddress,
  setLocalIpToEnv,
};
