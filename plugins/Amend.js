const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "ping3",
    alias: ["speed","pong"],
    use: '.ping',
    desc: "Check bot's response time with interactive buttons",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, prefix, sender, pushname, reply }) => {
    try {
        const start = new Date().getTime();
        
        // Send reaction first
        await conn.sendMessage(from, {  
            react: { text: '⚡', key: mek.key }  
        });

        const end = new Date().getTime();  
        const responseTime = (end - start) / 1000;  

        // Stylish ping message with cage format
        const pingMessage = `*╭┈───────────────•*

〈 Ping Status for ${config.BOT_NAME} 〉
╰┈───────────────•
╭┈───────────────•
│  ◦ Response Time : ${responseTime.toFixed(2)}ms
│  ◦ Status : Excellent
│  ◦ Version : ${config.VERSION || '4.0.0'}
╰┈───────────────•`;

        // Create buttons for ping response
        const generatebutton = [{
            buttonId: `${prefix}uptime`,
            buttonText: { displayText: '⏱️ UPTIME' },
            type: 1
        }, {
            buttonId: `${prefix}menu`,
            buttonText: { displayText: '📋 MAIN MENU' },
            type: 1
        }];

        // Send message with buttons
        await conn.sendMessage(from, {   
            video: { url: 'https://files.catbox.moe/acf262.mp4' },  
            caption: pingMessage,  
            gifPlayback: true,
            footer: `Tap buttons below for more options`,
            buttons: generatebutton,
            headerType: 4,
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
                    title: `${config.BOT_NAME} Ping`,  
                    body: pushname,  
                    mediaType: 2, // 2 for video  
                    thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg',  
                    sourceUrl: config.SUPPORT_LINK || "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",  
                    renderLargerThumbnail: true  
                }  
            }  
        }, { quoted: mek });  

    } catch (e) {  
        console.error("Ping Error:", e);  
        await conn.sendMessage(from, {   
            text: `*╭┈───────────────•*\n*┋* Ping Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,  
            contextInfo: {  
                mentionedJid: [sender],  
                forwardingScore: 999,  
                isForwarded: true  
            }  
        }, { quoted: mek });  
    }
});

// Uptime command to match the button
cmd({
    pattern: "uptime",
    desc: "Show bot uptime",
    category: "main",
    react: "⏱️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const uptimeMessage = `*╭┈───────────────•*
*│* ${config.BOT_NAME} Uptime
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* Uptime: ${runtime(process.uptime())}
*│  ◦* RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
*│  ◦* Node: ${process.version}
*╰┈───────────────•*`;

        await reply(uptimeMessage);
    } catch (e) {
        console.error("Uptime Error:", e);
        reply("Error fetching uptime information");
    }
});
