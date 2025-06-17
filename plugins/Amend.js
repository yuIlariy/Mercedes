import config from '../../config.js';

const fancyStyles = [
  "ᴍᴇʀᴄᴇᴅᴇs sᴘᴇᴇᴅ"
];

const colors = ["🫡", "☣️", "😇", "🥰", "👀", "😎", "😈", "❤️‍🔥", "💪"];

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) 
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "ping4" || cmd === "speed" || cmd === "pong") {
    const start = new Date().getTime();
    await m.React('⚡'); // Lightning reaction for speed
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const end = new Date().getTime();
    const responseTime = (end - start).toFixed(2);

    // Select random fancy style and color
    const fancyText = fancyStyles[Math.floor(Math.random() * fancyStyles.length)];
    const colorEmoji = colors[Math.floor(Math.random() * colors.length)];

    const responseText = `
${colorEmoji} *${fancyText}* *${responseTime}ms*

*╭┈───────────────•*
*〈 Ping Status for Mercedes 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* *Response Time : ${responseTime.toFixed(2)}ms*
*│  ◦* *Status : Excellent*
*│  ◦* *Version : 4.0.0*
*╰┈───────────────•*
`.trim();

    await sock.sendMessage(
      m.from,
      {
        text: responseText,
        footer: `✨ ${config.BOT_NAME} Performance ✨`,
        buttons: [
          {
            buttonId: `${prefix}ping`,
            buttonText: { displayText: "🔄 Refresh Ping" },
            type: 1
          },
          {
            buttonId: `${prefix}uptime`,
            buttonText: { displayText: "⏱️ Bot Uptime" },
            type: 1
          },
          {
            buttonId: `${prefix}menu`,
            buttonText: { displayText: "📋 Main Menu" },
            type: 1
          }
        ],
        headerType: 1,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363315182578784@newsletter',
            newsletterName: config.BOT_NAME,
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: `⚡ ${config.BOT_NAME} Performance ⚡`,
            body: "Real-time bot metrics",
            thumbnailUrl: config.MENU_IMAGE_URL || 'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/main/Pairing/1733805817658.webp',
            sourceUrl: config.SUPPORT_LINK || 'https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x',
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  }
};

// Helper functions
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

function formatMemoryUsage(memoryUsage) {
  const format = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  return `RSS: ${format(memoryUsage.rss)} | Heap: ${format(memoryUsage.heapUsed)}`;
}

export default ping;
