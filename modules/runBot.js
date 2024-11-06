const { getSystemStatus } = require("./getSystemStatus");
const bot = require("../bot");
const { getDockerStatus } = require("./getDockerStatus");

const _handleStartCommand = async (chatId) => {
  if (chatId === +process.env.TG_USER_CHAT_ID) {
    await bot.sendMessage(chatId, "What does my lord desire?", {
      reply_markup: {
        keyboard: [[{ text: "Get System Info" }, { text: "Get Docker Info" }, { text: "🔄 Reload bot" }]],
        resize_keyboard: true,
      },
    });
  } else {
    await bot.sendMessage(chatId, "Access Forbidden. 😨");
  }
};

module.exports = {
  async runBot() {
    console.log("Bot is running.");
    bot.on("message", async (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;

      try {
        if (text === "/start") {
          await _handleStartCommand(chatId);
        } else if (text === "🔄 Reload bot") {
          await _handleStartCommand(chatId);
        } else if (text === "Get System Info") {
          await getSystemStatus(chatId);
        } else if (text === "Get Docker Info") {
            await getDockerStatus(chatId);
          }
      } catch (e) {
        console.log(e);
        return bot.sendMessage(chatId, "Something was wrong");
      }
    });
  },
};
