const TelegramApi = require("node-telegram-bot-api");
require('dotenv').config()

//наш токен
const token = process.env.TG_BOT_TOKEN;

if (!token) {
  throw new Error("Telegram Bot Token not provided");
}

//создали бота
const bot = new TelegramApi(token, { polling: true });

module.exports = bot;
