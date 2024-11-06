const si = require("systeminformation");
const bot = require("../../../bot/bot");
const os = require("os");

module.exports = {
  async checkDiskSpaceAndMemory(chatId) {
    try {
      const diskData = await si.fsSize();
      const diskInfo = diskData[1];

      const freeDiskPercentage = (diskInfo.available / diskInfo.size) * 100;

      if (freeDiskPercentage < 20 && freeDiskPercentage >= 10) {
        await bot.sendMessage(chatId, `⚠️ Warning: Low disk space! Only ${freeDiskPercentage.toFixed(2)}% remaining.`);
      } else if (freeDiskPercentage < 10) {
        await bot.sendMessage(
          chatId,
          `🔥 Critical Warning: Very low disk space! Only ${freeDiskPercentage.toFixed(2)}% remaining. Immediate action recommended.`
        );
      }

      // Check RAM

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();

      const totalMemoryMB = (totalMemory / 1024 ** 3).toFixed(2);
      const freeMemoryMB = (freeMemory / 1024 ** 3).toFixed(2);

      const freeMemPercentage = (freeMemoryMB / totalMemoryMB) * 100;

      if (freeMemPercentage < 20 && freeMemPercentage >= 10) {
        await bot.sendMessage(chatId, `⚠️ Warning: Low memory! Only ${freeMemPercentage.toFixed(2)}% of RAM available.`);
      } else if (freeMemPercentage < 10) {
        await bot.sendMessage(
          chatId,
          `🔥 Critical Warning: Very low memory! Only ${freeMemPercentage.toFixed(2)}% of RAM available. Immediate action recommended.`
        );
      }
    } catch (error) {
      console.error("Error checking disk space or memory:", error);
      await bot.sendMessage(chatId, "Error checking system resources.");
    }
  },
};
