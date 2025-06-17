const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "ping5",
    alias: ["speed","pong"],
    use: '.ping',
    desc: "Check bot's response time with interactive buttons",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, prefix, quoted, sender, pushname, reply }) => {
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
*〈 Ping Status for ${config.BOT_NAME} 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* Response Time : ${responseTime.toFixed(2)}ms
*│  ◦* Status : Excellent
*│  ◦* Version : ${config.VERSION || '4.0.0'}
*╰┈───────────────•*`;

        // Create buttons for ping response
        const generatebutton = [
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
        ];

        // Send message with video and buttons
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

// ping2 command with video and buttons
cmd({
    pattern: "ping6",
    desc: "Check bot's response time (alternative) with buttons",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, prefix, pushname, sender, reply }) => {
    try {
        const startTime = Date.now();
        const message = await conn.sendMessage(from, { text: '*Testing speed...*' });
        const endTime = Date.now();
        const ping = endTime - startTime;

        // Stylish ping2 message with cage format
        const pingMessage = `*╭┈───────────────•*
*〈 Speed Test for ${config.BOT_NAME} 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* Response Time : ${ping}ms
*│  ◦* Status : Optimal
*│  ◦* Version : ${config.VERSION || '4.0.0'}
*╰┈───────────────•*`;

        // Create buttons for ping2 response
        const generatebutton = [
            {
                buttonId: `${prefix}ping2`,
                buttonText: { displayText: "🔄 Refresh Test" },
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
        ];

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
                    title: config.BOT_NAME + ' Speed Test',
                    body: pushname,
                    mediaType: 2,
                    thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg',
                    sourceUrl: config.SUPPORT_LINK || "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: message });

    } catch (e) {
        console.error("Ping2 Error:", e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Speed Test Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
