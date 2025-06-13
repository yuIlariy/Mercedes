const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot status with stylish format",
    category: "main",
    react: "🤫",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Stylish alive message with cage format
        const aliveMessage = `*╭┈───────────────•*
*〈 ${config.BOT_NAME} Alive Info 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* *Status : Running Smoothly*
*│  ◦* *Owner : ${config.OWNER_NAME}*
*│  ◦* *Version : 4.0.0*
*│  ◦* *Prefix : [${config.PREFIX}]*
*│  ◦* *Mode : [${config.MODE}]*
*│  ◦* *Host : Heroku*
*│  ◦* *Uptime : ${runtime(process.uptime())}*
*╰┈───────────────•*
> *Made By Marisel*`;

        await conn.sendMessage(from, { 
            video: { url: 'https://files.catbox.moe/zlisxh.mp4' },
            caption: aliveMessage,
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
                    title: `${config.BOT_NAME} Status`,
                    body: `Active & Online | Version 4.0.0`,
                    mediaType: 2,
                    thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/0omi8v.jpg',
                    sourceUrl: config.SUPPORT_LINK || "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Status Check Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
