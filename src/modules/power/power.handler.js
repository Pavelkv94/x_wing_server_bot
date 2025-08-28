const bot = require("../../bot/bot");
const CALLBACKS = require("../../constants/callbacks");

module.exports = {
  async _showInlineKeyboardForShutDown(chatId, command) {
    await bot.sendMessage(chatId, `Are you sure you want to ${command} the server?`, {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: [
          [
            { text: "🔻Yes", callback_data: command },
            { text: "🟩 No", callback_data: CALLBACKS.DELETE_MESSAGE },
          ],
        ],
      },
    });
  },
};