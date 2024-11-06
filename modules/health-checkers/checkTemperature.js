const si = require("systeminformation");
const bot = require("../../bot");

module.exports = {
  async checkTemperature(chatId) {
    try {
      const cpuTemperature = await si.cpuTemperature();
      const cpuTemp = cpuTemperature.main;

      if (cpuTemp >= 75 && cpuTemp < 85) {
        await bot.sendMessage(chatId, `⚠️ Warning: CPU temperature is elevated (${cpuTemp}°C). Check cooling or ventilation.`);
      } else if (cpuTemp >= 85) {
        await bot.sendMessage(chatId, `🔥 Critical Warning: CPU temperature is very high (${cpuTemp}°C)! Immediate action recommended.`);
      } else {
        console.log(`CPU temperature is within safe limits: ${cpuTemp}°C`);
      }
    } catch (error) {
      console.error("Error fetching system information:", error);
    }
  },
};
