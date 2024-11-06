const si = require("systeminformation");
const bot = require("../../bot");

module.exports = {
  async checkDiskSpaceAndMemory(chatId) {
    try {
      const diskData = await si.fsSize();
      const diskInfo = diskData[0];

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
      const memData = await si.mem();
      const freeMemPercentage = (memData.available / memData.total) * 100;

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
