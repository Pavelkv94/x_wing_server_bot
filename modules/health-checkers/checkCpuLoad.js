const bot = require("../../bot");

module.exports = {
  async checkCpuLoad(chatId) {
    try {
      const loadData = await si.currentLoad();
      const cpuLoad = loadData.currentLoad;
      const loadAvg = loadData.avgload;

      if (cpuLoad >= 75 && cpuLoad < 90) {
        await bot.sendMessage(chatId, `⚠️ Warning: CPU load is high (${cpuLoad.toFixed(1)}%). Performance may be impacted.`);
      } else if (cpuLoad >= 90) {
        await bot.sendMessage(chatId, `🔥 Critical Warning: CPU load is very high (${cpuLoad.toFixed(1)}%)! Consider reducing workload.`);
      }

      if (loadAvg > 3.0 && loadAvg < 4.0) {
        await bot.sendMessage(chatId, `⚠️ Warning: System load average is high (${loadAvg.toFixed(1)}).`);
      } else if (loadAvg >= 4.0) {
        await bot.sendMessage(chatId, `🔥 Critical Warning: System load average is very high (${loadAvg.toFixed(1)}). Immediate action recommended.`);
      }
    } catch (error) {
      console.error("Error checking CPU load:", error);
    }
  },
};
