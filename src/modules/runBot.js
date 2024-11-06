const { getSystemStatus } = require("./monitoring/getSystemStatus");
const { getDockerStatus } = require("./monitoring/getDockerStatus");
const bot = require("../bot/bot");
const { shutdown } = require("./controls/shutdown");

const _handleStartCommand = async (chatId) => {
  if (chatId === +process.env.TG_USER_CHAT_ID) {
    await bot.sendMessage(chatId, "What does my lord desire?", {
      reply_markup: {
        keyboard: [["Get System Info", "Get Docker Info", "🔄 Reload bot"], ["Test"]],
        resize_keyboard: true,
      },
    });
  } else {
    await bot.sendMessage(chatId, "Access Forbidden. 😨");
  }
};

const _showInlineKeyboard = async (chatId) => {
  await bot.sendMessage(chatId, "Are you sure you want to shut down the server?", {
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,

      inline_keyboard: [
        [
          { text: "🔻Yes", callback_data: "shutdown" },
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
        if (text === "/start") {
          await _handleStartCommand(chatId);
        } else if (text === "🔄 Reload bot") {
          await _handleStartCommand(chatId);
        } else if (text === "📊 Get System Info") {
          await getSystemStatus(chatId);
        } else if (text === "🐋Get Docker Info") {
          await getDockerStatus(chatId);
        } else if (text === "⭕️ Shutdown") {
          await _showInlineKeyboard(chatId);
        }
      } catch (e) {
        console.log(e);
        return bot.sendMessage(chatId, "Something was wrong");
      }
    });

    bot.on("callback_query", async (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      if (data === "shutdown") {
        await shutdown(chatId);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === "deleteMessage") {
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      }

      // Acknowledge the callback query
      bot.answerCallbackQuery(callbackQuery.id);
    });
  },
};
