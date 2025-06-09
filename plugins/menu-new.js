const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🫩",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply, sender }) => {
    try {
        // Count total commands
        const totalCommands = Object.keys(commands).length;
        
        const menuCaption = `*╭┈───────────────•*
*〈 Hello *${pushname}* Welcome*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}
*│  ◦* ʀᴀᴍ ᴜꜱᴀɢᴇ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*│  ◦* ᴍᴏᴅᴇ : *[${config.MODE}]*
*│  ◦* ᴘʀᴇғɪx : *[${config.PREFIX}]*
*│  ◦* ᴄᴍᴅs : *${totalCommands}*
*╰┈───────────────•*
*◆─〈 ✦${config.BOT_NAME}✦ 〉─◆*
*╭┈───────────────•*
*├ 1* •  *Download Menu*
*├ 2* • *Group Menu*
*├ 3* • *Fun Menu*
*├ 4* • *Owner Menu*
*├ 5* • *AI Menu*
*├ 6* • *Anime Menu*
*├ 7* • *Convert Menu*
*├ 8* • *Other Menu*
*├ 9* • *Reactions Menu*
*├ 10* • *Main Menu*
*╰┈───────────────•*

*Reply With Number You want*

> *${config.BOT_NAME}*`;

        const contextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: config.BOT_NAME,
                body: pushname,
                mediaType: 1,
                thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg',
                sourceUrl: config.SUPPORT_LINK || 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
                renderLargerThumbnail: true
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Send image with timeout
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo: contextInfo },
                { quoted: mek }
            );
        }
        
        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: `*DOWNLOADER-CMD*                        
*╭┈───────────────•*
*┋* *.ғᴀᴄᴇʙᴏᴏᴋ*
*┋* *.ᴍᴇᴅɪᴀғɪʀᴇ*
*┋* *.ᴛɪᴋᴛᴏᴋ*
*┋* *.ᴛᴡɪᴛᴛᴇʀ*
*┋* *.ɪɴꜱᴛᴀ*
*┋* *.ᴀᴘᴋ*
*┋* *.ɪᴍɢ*
*┋* *.ᴛᴛ2*
*┋* *.ᴘɪɴꜱ*
*┋* *.ᴀᴘᴋ2*
*┋* *.ғʙ2*
*┋* *.ᴘɪɴᴛᴇʀᴇꜱᴛ*
*┋* *.ꜱᴘᴏᴛɪғʏ*
*┋* *.ᴘʟᴀʏ*
*┋* *.ᴘʟᴀʏ2-10*
*┋* *.ᴀᴜᴅɪᴏ*
*┋* *.ᴠɪᴅᴇᴏ*
*┋* *.ᴠɪᴅᴇᴏ2-10*
*┋* *.ʏᴛᴍᴘ3*
*┋* *.ʏᴛᴍᴘ4*
*┋* *.ꜱᴏɴɢ*
*┋* *.ᴅᴀʀᴀᴍᴀ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `*GROUP-CMD*
*╭┈───────────────•*
*┋* *.ɢʀᴏᴜᴘʟɪɴᴋ*
*┋* *.ᴋɪᴄᴋᴀʟʟ*
*┋* *.ᴋɪᴄᴋᴀʟʟ2*
*┋* *.ᴋɪᴄᴋᴀʟʟ3*
*┋* *.ᴀᴅᴅ*
*┋* *.ʀᴇᴍᴏᴠᴇ*
*┋* *.ᴋɪᴄᴋ*
*┋* *.ᴘʀᴏᴍᴏᴛᴇ*
*┋* *.ᴅᴇᴍᴏᴛᴇ*
*┋* *.ᴅɪꜱᴍɪꜱꜱ*
*┋* *.ʀᴇᴠᴏᴋᴇ*
*┋* *.ᴍᴜᴛᴇ*
*┋* *.ᴜɴᴍᴜᴛᴇ*
*┋* *.ʟᴏᴄᴋɢᴄ*
*┋* *.ᴜɴʟᴏᴄᴋɢᴄ*
*┋* *.ᴛᴀɢ*
*┋* *.ʜɪᴅᴇᴛᴀɢ*
*┋* *.ᴛᴀɢᴀʟʟ*
*┋* *.ᴛᴀɢᴀᴅᴍɪɴꜱ*
*┋* *.ɪɴᴠɪᴛᴇ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `*FUN-CMD*
*╭┈───────────────•*
*┋* *.ꜱʜᴀᴘᴀʀ*
*┋* *.ʀᴀᴛᴇ*
*┋* *.ɪɴꜱᴜʟᴛ*
*┋* *.ʜᴀᴄᴋ*
*┋* *.ꜱʜɪᴘ*
*┋* *.ᴄʜᴀʀᴀᴄᴛᴇʀ*
*┋* *.ᴘɪᴄᴋᴜᴘ*
*┋* *.ᴊᴏᴋᴇ*
*┋* *.ʜʀᴛ*
*┋* *.ʜᴘʏ*
*┋* *.ꜱʏᴅ*
*┋* *.ᴀɴɢᴇʀ*
*┋* *.ꜱʜʏ*
*┋* *.ᴋɪꜱꜱ*
*┋* *.ᴍᴏɴ*
*┋* *.ᴄᴜɴғᴜᴢᴇᴅ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `*OWNER-CMD*
*╭┈───────────────•*
*┋* *.ʙʟᴏᴄᴋ*
*┋* *.ᴜɴʙʟᴏᴄᴋ*
*┋* *.ғᴜʟʟᴘᴘ*
*┋* *.ꜱᴇᴛᴘᴘ*
*┋* *.ʀᴇꜱᴛᴀʀᴛ*
*┋* *.ꜱʜᴜᴛᴅᴏᴡɴ*
*┋* *.ᴜᴘᴅᴀᴛᴇᴄᴍᴅ*
*┋* *.ɢᴊɪᴅ*
*┋* *.ᴊɪᴅ*
*┋* *.ʟɪꜱᴛᴄᴍᴅ*
*┋* *.ᴀʟʟᴍᴇɴᴜ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `*AI-CMD*
*╭┈───────────────•*
*┋* *.ᴀɪ*
*┋* *.ɢᴘᴛ3*
*┋* *.ɢᴘᴛ2*
*┋* *.ɢᴘᴛᴍɪɴɪ*
*┋* *.ɢᴘᴛ*
*┋* *.ᴍᴇᴛᴀ*
*┋* *.ɪᴍᴀɢɪɴᴇ*
*┋* *.ɪᴍᴀɢɪɴᴇ2*
*┋* *.ʙʟᴀᴄᴋʙᴏx*
*┋* *.ʟᴜᴍᴀ*
*┋* *.ᴅᴊ*
*┋* *.ᴋʜᴀɴ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `*ANIME-CMD*
*╭┈───────────────•*
*┋* *.ғᴀᴄᴋ*
*┋* *.ᴅᴏɢ*
*┋* *.ᴀᴡᴏᴏ*
*┋* *.ɢᴀʀʟ*
*┋* *.ᴡᴀɪғᴜ*
*┋* *.ɴᴇᴋᴏ*
*┋* *.ᴍᴇɢɴᴜᴍɪɴ*
*┋* *.ᴍᴀɪᴅ*
*┋* *.ʟᴏʟɪ*
*┋* *.ᴀɴɪᴍᴇɢɪʀʟ*
*┋* *.ᴀɴɪᴍᴇɢɪʀʟ1-5*
*┋* *.ᴀɴɪᴍᴇ1-5*
*┋* *.ғᴏxɢɪʀʟ*
*┋* *.ɴᴀʀᴜᴛᴏ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `*CONVERTER-CMD*
*╭┈───────────────•*
*┋* *.ꜱᴛɪᴄᴋᴇʀ*
*┋* *.ꜱᴛɪᴄᴋᴇʀ2*
*┋* *.ᴇᴍᴏᴊɪᴍɪx 😎+😂*
*┋* *.ᴛᴀᴋᴇ*
*┋* *.ᴛᴏᴍᴘ3*
*┋* *.ғᴀɴᴄʏ*
*┋* *.ᴛᴛꜱ*
*┋* *.ᴛʀᴛ*
*┋* *.ʙᴀꜱᴇ64*
*┋* *.ᴜɴʙᴀꜱᴇ64*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `*OTHER-CMD*
*╭┈───────────────•*
*┋* *.ᴛɪᴍᴇɴᴏᴡ*
*┋* *.ᴅᴀᴛᴇ*
*┋* *.ᴄᴏᴜɴᴛ*
*┋* *.ᴄᴀʟᴄᴜʟᴀᴛᴇ*
*┋* *.ᴄᴏᴜɴᴛx*
*┋* *.ғʟɪᴘ*
*┋* *.ᴄᴏɪɴғʟɪᴘ*
*┋* *.ʀᴄᴏʟᴏʀ*
*┋* *.ʀᴏʟʟ*
*┋* *.ғᴀᴄᴛ*
*┋* *.ᴅᴇғɪɴᴇ*
*┋* *.ɴᴇᴡꜱ*
*┋* *.ᴍᴏᴠɪᴇ*
*┋* *.ᴡᴇᴀᴛʜᴇʀ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `*REACTIONS-CMD*
*╭┈───────────────•*
*┋* *.ᴄᴜᴅᴅʟᴇ*
*┋* *.ʜᴜɢ*
*┋* *.ᴋɪꜱꜱ*
*┋* *.ʟɪᴄᴋ*
*┋* *.ᴘᴀᴛ*
*┋* *.ʙᴜʟʟʏ*
*┋* *.ʙᴏɴᴋ*
*┋* *.ʏᴇᴇᴛ*
*┋* *.ꜱʟᴀᴘ*
*┋* *.ᴋɪʟʟ*
*┋* *.ʙʟᴜꜱʜ*
*┋* *.ꜱᴍɪʟᴇ*
*┋* *.ʜᴀᴘᴘʏ*
*┋* *.ᴡɪɴᴋ*
*┋* *.ᴘᴏᴋᴇ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `*MAIN-CMD*
*╭┈───────────────•*
*┋* *.ᴘɪɴɢ*
*┋* *.ʟɪᴠᴇ*
*┋* *.ᴀʟɪᴠᴇ*
*┋* *.ʀᴜɴᴛɪᴍᴇ*
*┋* *.ᴜᴘᴛɪᴍᴇ*
*┋* *.ʀᴇᴘᴏ*
*┋* *.ᴏᴡɴᴇʀ*
*┋* *.ᴍᴇɴᴜ*
*┋* *.ᴍᴇɴᴜ2*
*┋* *.ʀᴇꜱᴛᴀʀᴛ*
*╰┈───────────────•*

> *${config.BOT_NAME}*`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg' },
                                        caption: selectedMenu.content,
                                        contextInfo: {
                                            mentionedJid: [sender],
                                            forwardingScore: 999,
                                            isForwarded: true
                                        }
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { 
                                        text: selectedMenu.content,
                                        contextInfo: {
                                            mentionedJid: [sender],
                                            forwardingScore: 999,
                                            isForwarded: true
                                        }
                                    },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { 
                                    text: selectedMenu.content,
                                    contextInfo: {
                                        mentionedJid: [sender],
                                        forwardingScore: 999,
                                        isForwarded: true
                                    }
                                },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.BOT_NAME}`,
                                contextInfo: {
                                    mentionedJid: [sender],
                                    forwardingScore: 999,
                                    isForwarded: true
                                }
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { 
                    text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.BOT_NAME}`,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
