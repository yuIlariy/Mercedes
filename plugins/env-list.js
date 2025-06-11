const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "🥹",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply, isCreator, pushname }) => {
    try {
        if (!isCreator) {
            return reply("*╭┈───────────────•*\n*┋* Owner Only Command!\n*┋* Not authorized to view config\n*╰┈───────────────•*");
        }

        // Stylish env message with cage format
        const envMessage = `*╭┈───────────────•*
*〈 ${config.BOT_NAME} Configuration 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 🤖 *BOT INFO*
*│     • Name:* ${config.BOT_NAME}
*│     • Prefix:* ${config.PREFIX}
*│     • Owner:* ${config.OWNER_NAME}
*│     • Number:* ${config.OWNER_NUMBER}
*│     • Mode:* ${config.MODE.toUpperCase()}
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* ⚙️ *CORE SETTINGS*
*│     • Public Mode:* ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
*│     • Always Online:* ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
*│     • Read Msgs:* ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
*│     • Read Cmds:* ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 🔌 *AUTOMATION*
*│     • Auto Reply:* ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
*│     • Auto React:* ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
*│     • Custom React:* ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
*│     • React Emojis:* ${config.CUSTOM_REACT_EMOJIS}
*│     • Auto Sticker:* ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 🛡️ *SECURITY*
*│     • Anti-Link:* ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
*│     • Anti-Bad:* ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
*│     • Anti-VV:* ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}
*│     • Del Links:* ${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"}
*╰┈───────────────•*
> *Made By Marisel*`;

        await conn.sendMessage(from, { 
            video: { url: 'https://files.catbox.moe/zlisxh.mp4' },
            caption: envMessage,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: config.OWNER_NAME || config.BOT_NAME,
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `${config.BOT_NAME} Configuration`,
                    body: `Owner: ${config.OWNER_NAME}`,
                    mediaType: 2,
                    thumbnailUrl: 'https://files.catbox.moe/8eksy6.jpg',
                    sourceUrl: "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('Env command error:', error);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Config Error!\n*┋* ${error.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
