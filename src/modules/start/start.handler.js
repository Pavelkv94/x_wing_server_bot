const bot = require("../../bot/bot");
const COMMANDS = require("../../constants/commands");

module.exports = {
  async _handleStartCommand(chatId) {
    await bot.sendMessage(chatId, "What does my lord desire?", {
      reply_markup: {
        keyboard: [
          [COMMANDS.SYSTEM_INFO, COMMANDS.DOCKER_INFO, COMMANDS.LOGS],
          [COMMANDS.SHUTDOWN, COMMANDS.REBOOT],
        ],
        resize_keyboard: true,
      },
    });
  },
};