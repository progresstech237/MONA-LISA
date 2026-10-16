const fs = require("fs");
const brand = require("./lib/brand");
if (fs.existsSync("config.env")) {
  require("dotenv").config({ path: "./config.env" });
}

function convertToBool(text, trueValue = "true") {
  return text === trueValue;
}

module.exports = {
  // Session
  SESSION_ID: process.env.SESSION_ID || "",

  // Bot Personalization & Branding
  BOT_NAME: brand.BOT_NAME,
  OWNER_NAME: brand.OWNER_NAME,
  OWNER_NUMBER: brand.OWNER_NUMBER,
  BOT_PIC: process.env.BOT_PIC || "https://files.catbox.moe/w4ttld.jpg",
  FOOTER: brand.FOOTER,
  PREFIX: process.env.PREFIX || ".",

  // Third-party REST API used by downloader/AI commands. Override per deployment; no key is hardcoded.
  API_BASE: process.env.API_BASE || "https://api.giftedtech.my.id",
  API_KEY: process.env.API_KEY || "",

  // Mode & Permissions
  MODE: process.env.MODE || "public",
  SUDO: process.env.SUDO ? process.env.SUDO.split(",") : [brand.OWNER_NUMBER],

  // Bot Features & Behaviors
  AUTO_REACT: convertToBool(process.env.AUTO_REACT, "true"),
  AUTO_READ_STATUS: convertToBool(process.env.AUTO_READ_STATUS, "true"),
  AUTO_LIKE_STATUS: convertToBool(process.env.AUTO_LIKE_STATUS, "true"),
  AUTO_RECORDING: convertToBool(process.env.AUTO_RECORDING, "false"),
  AUTO_TYPING: convertToBool(process.env.AUTO_TYPING, "false"),
  ALWAYS_ONLINE: convertToBool(process.env.ALWAYS_ONLINE, "true"),
  ANTI_CALL: convertToBool(process.env.ANTI_CALL, "false"),
  ANTI_DELETE: convertToBool(process.env.ANTI_DELETE, "true"),
  ANTI_LINK: convertToBool(process.env.ANTI_LINK, "true"),
  BAD_NO_BLOCK: convertToBool(process.env.BAD_NO_BLOCK, "false"),
  READ_MESSAGE: convertToBool(process.env.READ_MESSAGE, "false"),
};
