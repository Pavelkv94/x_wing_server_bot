const { checkCpuLoad } = require("./modules/monitoring/health-checkers/cpuLoad.checker");
const { checkDiskSpaceAndMemory } = require("./modules/monitoring/health-checkers/diskSpaceAndMemory.checker");
const { checkTemperature } = require("./modules/monitoring/health-checkers/temperature.checker");
const { runBot } = require("./runBot");

runBot();

const intervalId = setInterval(() => {
  try {
    console.log("health check");
    checkCpuLoad(process.env.TG_USER_CHAT_ID);
    checkDiskSpaceAndMemory(process.env.TG_USER_CHAT_ID);
    checkTemperature(process.env.TG_USER_CHAT_ID);
  } catch (error) {
    console.error("Error in health check:", error);
  }
}, 60 * 1000);

process.on("SIGINT", () => {
  console.log("Stopping health checks...");
  clearInterval(intervalId);
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("Stopping health checks...");
  clearInterval(intervalId);
  process.exit();
});
