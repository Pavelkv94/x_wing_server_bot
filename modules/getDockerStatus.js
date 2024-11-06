const si = require("systeminformation");
const bot = require("../bot"); // assuming your bot is set up in ../bot

module.exports = {
  async getDockerStatus(chatId) {
    try {
      const containers = await si.dockerContainers();

      const containersInfo = await Promise.all(
        containers.map(async (container) => {
          const stats = await si.dockerContainerStats(container.id);

          return `
Stats for 🔷${container.name}🔷:
Status: ${container.state}
CPU: ${stats[0].cpuPercent.toFixed(2)}%
Memory Usage: ${(stats[0].memUsage / 1024 ** 2).toFixed(2)} MB
Memory Limit: ${(stats[0].memLimit / 1024 ** 2).toFixed(2)} MB
Network received: ${(stats[0].netIO.rx / 1024 ** 2).toFixed(2)} MB
Network sent: ${(stats[0].netIO.wx / 1024 ** 2).toFixed(2)} MB
          `;
        })
      );

      await bot.sendMessage(chatId, containersInfo.join("\n"));
    } catch (error) {
      console.error("Error fetching Docker container information:", error);
      await bot.sendMessage(chatId, "Failed to fetch Docker container information.");
    }
  },
};
