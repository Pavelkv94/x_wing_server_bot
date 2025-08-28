const bot = require("../../bot/bot");

module.exports = {
  // interval in hours
  async getLogs(chatId, interval) {

    const res = await fetch(`${process.env.MONITANA_URL}/tg/logs?period=${interval}`);
    if (!res.ok) {
      await bot.sendMessage(chatId, "Failed to get logs");
      return;
    }
    const data = await res.json();

    const { total,
      uniqueIPs,
      errorCount,
      errorPercent,
      topCountries,
      topDevices,
      topSuspiciousIPs,
      topSuspiciousPaths,
      successCount,
      clientErrorCount,
      serverErrorCount } = data;

    const intervals = {
      "24": "сутки",
      "168": "неделю",
      "720": "месяц",
    }

    const message = `
📊 Логи за ${intervals[interval]}:
— Всего: ${total}
— Уникальных IP: ${uniqueIPs}
— Ошибок: ${errorCount} (${errorPercent}%)
    
✅ Успешные: ${successCount}
❌ Ошибки клиента (4xx): ${clientErrorCount}
🔥 Ошибки сервера (5xx): ${serverErrorCount}
    
🌍 География:
${topCountries.join('\n')}
    
📱 Устройства:
${topDevices.join('\n')}
    
🚨 Подозрительные:
${[...topSuspiciousIPs, ...topSuspiciousPaths.map(path => path.replace('/', '/\u200B'))].join('\n')}
`.trim();

    await bot.sendMessage(chatId, message);
  },
};
