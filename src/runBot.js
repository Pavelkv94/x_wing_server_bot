const { getSystemStatus } = require("./modules/monitoring/getSystemStatus");
const { getDockerStatus } = require("./modules/monitoring/getDockerStatus");
const bot = require("./bot/bot");
const { shutdown, reboot } = require("./modules/power/shutdown");
const COMMANDS = require("./constants/commands");
const CALLBACKS = require("./constants/callbacks");
const { _showInlineKeyboardForShutDown } = require("./modules/power/power.handler");
const { _showInlineKeyboardForGetLogs } = require("./modules/logs/logs.handler");
const { _handleStartCommand } = require("./modules/start/start.handler");
const INTERVALS = require("./constants/interval");
const { getLogs } = require("./modules/logs/getLogs");


module.exports = {
  async runBot() {
    console.log("Bot is running.");
    bot.on("message", async (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;

      try {
        if (chatId !== +process.env.TG_USER_CHAT_ID) {
          await bot.sendMessage(chatId, "Access Forbidden. 😨");
        } else if (text === COMMANDS.START) {
          await _handleStartCommand(chatId);
        } else if (text === COMMANDS.LOGS) {
          await _showInlineKeyboardForGetLogs(chatId);
        } else if (text === COMMANDS.SYSTEM_INFO) {
          await getSystemStatus(chatId);
        } else if (text === COMMANDS.DOCKER_INFO) {
          await getDockerStatus(chatId);
        } else if (text === COMMANDS.SHUTDOWN) {
          await _showInlineKeyboardForShutDown(chatId, CALLBACKS.SHUTDOWN);
        } else if (text === COMMANDS.REBOOT) {
          await _showInlineKeyboardForShutDown(chatId, CALLBACKS.REBOOT);
        }
      } catch (e) {
        console.log(e);
        return bot.sendMessage(chatId, "Something was wrong");
      }
    });

    bot.on("callback_query", async (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      if (data === CALLBACKS.SHUTDOWN) {
        await shutdown(chatId);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === CALLBACKS.DELETE_MESSAGE) {
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      }

      if (data === CALLBACKS.REBOOT) {
        await reboot(chatId);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === CALLBACKS.DELETE_MESSAGE) {
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      }

      if (data === CALLBACKS.LOGS_24H) {
        await getLogs(chatId, INTERVALS.I_24H);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === CALLBACKS.LOGS_7D) {
        await getLogs(chatId, INTERVALS.I_7D);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      } else if (data === CALLBACKS.LOGS_30D) {
        await getLogs(chatId, INTERVALS.I_30D);
        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
      }

      // Acknowledge the callback query
      bot.answerCallbackQuery(callbackQuery.id);
    });
  },
};
