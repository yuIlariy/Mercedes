const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply, sender }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);

        // Stylish uptime message with cage format
        const uptimeMessage = `*╭┈───────────────•*
*〈 Uptime Status for Mercedes 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* Runtime : ${uptime}
*│  ◦* Start Time : ${startTime.toLocaleString()}
*│  ◦* Stability : 100%
*│  ◦* Version : 4.0.0
*╰┈───────────────•*
> *Made By Marisel*`;

        await conn.sendMessage(from, { 
            video: { url: 'https://files.catbox.moe/6zh63g.mp4' },
            caption: uptimeMessage,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: config.OWNER_NAME || config.BOT_NAME,
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: config.BOT_NAME + ' Uptime',
                    body: pushname,
                    mediaType: 2, // 2 for video
                    thumbnailUrl: 'https://files.catbox.moe/dh6896.jpg',
                    sourceUrl: "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Uptime Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
