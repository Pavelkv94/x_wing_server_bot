const TelegramApi = require("node-telegram-bot-api");
require('dotenv').config()

const token = process.env.TG_BOT_TOKEN ;

if (!token) {
  throw new Error("Telegram Bot Token not provided");
}

const bot = new TelegramApi(token, { polling: true });

module.exports = bot;
