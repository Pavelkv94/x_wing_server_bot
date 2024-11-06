const si = require("systeminformation");
const bot = require("../bot");

module.exports = {
  async getSystemStatus(chatId) {
    try {
      const cpuTemperature = await si.cpuTemperature();
      const cpuLoad = await si.currentLoad();
      const uptime = await si.time();

      const memory = await si.mem();
      const disk = await si.fsSize();
      const diskFree = disk[0].available / 1024 / 1024 / 1024;
      const diskTotal = disk[0].size / 1024 / 1024 / 1024;
      const networkStats = await si.networkStats();

      const platform = await si.osInfo();
      bot.sendMessage(
        chatId,
        `
        💻 ${platform.platform} ${platform.distro} ${platform.release} Arch: ${platform.arch} (${platform.hostname})
System Uptime: ${(uptime.uptime / 3600).toFixed(2)} hours

CPU Temperature: ${cpuTemperature.main}°C ${cpuTemperature.main > 75 ? "🔴" : cpuTemperature.main > 45 ? "🟠" : "🟢"}    
CPU Load: ${cpuLoad.currentLoad.toFixed(2)}%

Memory Used(RAM): ${(memory.used / (1024 ** 3)).toFixed(2)} GB
Memory Free(RAM): ${(memory.free / (1024 ** 3)).toFixed(2)} GB
Disk Space: ${diskFree.toFixed(2)} GB free / ${diskTotal.toFixed(2)} GB total

${networkStats.map((net) => `Network (${net.iface}) - Rx: ${net.rx_sec} B/sec, Tx: ${net.tx_sec} B/sec\n`)}

        
        `
      );
    } catch (error) {
      console.error("Error fetching system information:", error);
    }
  },
};
