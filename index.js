const { checkCpuLoad } = require("./modules/health-checkers/checkCpuLoad");
const { checkDiskSpaceAndMemory } = require("./modules/health-checkers/checkDiskSpaceAndMemory");
const { checkTemperature } = require("./modules/health-checkers/checkTemperature");
const { runBot } = require("./modules/runBot");

runBot();

const intervalId = setInterval(() => {
  try {
    console.log("timer");
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
