const { getSystemStatus } = require("./monitoring/getSystemStatus");
const { getDockerStatus } = require("./monitoring/getDockerStatus");
const bot = require("../bot/bot");
const { shutdown, reboot } = require("./controls/shutdown");

const _handleStartCommand = async (chatId) => {
  await bot.sendMessage(chatId, "What does my lord desire?", {
    reply_markup: {
      keyboard: [
        ["📊 Get System Info", "🐋 Get Docker Info", "🌀 Homepage"],
        ["🛑 Shutdown", "⭕️ Reboot"],
      ],
      resize_keyboard: true,
    },
  });
};

const sendHomepageLink = async (chatId) => {
  await bot.sendMessage(chatId, `${process.env.HOMEPAGE_URL}`);
}

const _showInlineKeyboard = async (chatId, command) => {
  await bot.sendMessage(chatId, `Are you sure you want to ${command} the server?`, {
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
      inline_keyboard: [
        [
          { text: "🔻Yes", callback_data: command },
          { text: "🟩 No", callback_data: "deleteMessage" },
        ],
      ],
    },
  });
};

module.exports = {
  async runBot() {
    console.log("Bot is running.");
    bot.on("message", async (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;

      try {
        if (chatId !== +process.env.TG_USER_CHAT_ID) {
          await bot.sendMessage(chatId, "Access Forbidden. 😨");
        } else if (text === "/start") {
          await _handleStartCommand(chatId);
        } else if (text === "🌀 Homepage") {
          await sendHomepageLink(chatId);
        } else if (text === "📊 Get System Info") {
          await getSystemStatus(chatId);
        } else if (text === "🐋 Get Docker Info") {
          await getDockerStatus(chatId);
        } else if (text === "🛑 Shutdown") {
          await _showInlineKeyboard(chatId, "shut down");
        } else if (text === "⭕️ Reboot") {
          await _showInlineKeyboard(chatId, "reboot");
        }
      } catch (e) {
        console.log(e);
        return bot.sendMessage(chatId, "Something was wrong");
      }
    });

    bot.on("callback_query", async (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      if (data === "shut down") {
        await shutdown(chatId);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === "deleteMessage") {
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      }

      if (data === "reboot") {
        await reboot(chatId);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === "deleteMessage") {
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      }

      // Acknowledge the callback query
      bot.answerCallbackQuery(callbackQuery.id);
    });
  },
};
