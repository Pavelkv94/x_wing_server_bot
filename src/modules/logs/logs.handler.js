const bot = require("../../bot/bot");
const CALLBACKS = require("../../constants/callbacks");

module.exports = {
  async _showInlineKeyboardForGetLogs(chatId) {
    await bot.sendMessage(chatId, `Choose the logs interval:`, {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: [
          [
            { text: "24h", callback_data: CALLBACKS.LOGS_24H },
            { text: "7d", callback_data: CALLBACKS.LOGS_7D },
            { text: "30d", callback_data: CALLBACKS.LOGS_30D },
          ],
        ],
      },
    });
  },
};