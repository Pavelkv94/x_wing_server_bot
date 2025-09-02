const shell = require("shelljs");
const bot = require("../../bot/bot");

module.exports = {
  async shutdown(chatId) {
    await bot.sendMessage(chatId, "🟥 X-wing server will shutdown...");

    shell.exec(`echo ${process.env.SERVER_PASS} | sudo -S shutdown now`);
  },
  async reboot(chatId) {
    await bot.sendMessage(chatId, "⭕️ X-wing server will restart...");

    shell.exec(`echo ${process.env.SERVER_PASS} | sudo -S reboot`);
  },
};
