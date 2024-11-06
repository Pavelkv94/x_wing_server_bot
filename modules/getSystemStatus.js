const si = require("systeminformation");
const bot = require("../bot");
const os = require("os");

module.exports = {
  async getSystemStatus(chatId) {
    try {
      const cpuTemperature = await si.cpuTemperature();
      const cpuLoad = await si.currentLoad();
      const uptime = await si.time();

      const disk = await si.fsSize();
      const diskFree = disk[1].available / 1024 / 1024 / 1024;
      const diskTotal = disk[1].size / 1024 / 1024 / 1024;
      const networkStats = await si.networkStats();

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();

      const totalMemoryMB = (totalMemory / 1024 ** 3).toFixed(2);
      const freeMemoryMB = (freeMemory / 1024 ** 3).toFixed(2);
      const usedMemoryMB = (totalMemoryMB - freeMemoryMB).toFixed(2);

      const platform = await si.osInfo();

      const networkInfo = networkStats
        .map((net) => {
          const rxMB = (net.rx_sec / 1024 / 1024).toFixed(2); // Received data in MB/sec
          const txMB = (net.tx_sec / 1024 / 1024).toFixed(2); // Transmitted data in MB/sec
          return `Network (${net.iface}) - Rx: ${rxMB} MB/sec, Tx: ${txMB} MB/sec\n`;
        })
        .join("");

      bot.sendMessage(
        chatId,
        `
        💻 ${platform.platform} ${platform.distro} ${platform.release} Arch: ${platform.arch} (${platform.hostname})
        
System Uptime: ${(uptime.uptime / 3600).toFixed(2)} hours

CPU Temperature: ${cpuTemperature.main}°C ${cpuTemperature.main > 75 ? "🔴" : cpuTemperature.main > 45 ? "🟠" : "🟢"}    
CPU Load: ${cpuLoad.currentLoad.toFixed(2)}%

Memory Used(RAM): ${usedMemoryMB}/${totalMemoryMB} GB
Memory Free(RAM): ${freeMemoryMB}/${totalMemoryMB} GB

Disk Space: ${diskFree.toFixed(2)} GB free / ${diskTotal.toFixed(2)} GB total

${networkInfo}

        
        `
      );
    } catch (error) {
      console.error("Error fetching system information:", error);
    }
  },
};
