const shell = require("shelljs");
const bot = require("../../bot/bot");

module.exports = {
  async shutdown() {
    await bot.sendMessage(chatId, "🟥 X-wing server will shutdown...");

    shell.exec(`echo ${process.env.SERVER_PASS} | sudo -S shutdown now`);
  },
};
