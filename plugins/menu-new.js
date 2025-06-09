const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply, sender }) => {
    try {
        // Count total commands
        const totalCommands = Object.keys(commands).length;
        
        const menuCaption = `*╭┈───────────────•*
*〈 Hello *${pushname}* Welcome*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* Runtime : ${runtime(process.uptime())}
*│  ◦* RAM Usage : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*│  ◦* Mode : *[${config.MODE}]*
*│  ◦* Prefix : *[${config.PREFIX}]*
*│  ◦* Commands : *${totalCommands}*
*╰┈───────────────•*
*◆─〈 ✦${config.BOT_NAME}✦ 〉─◆*
*╭┈───────────────•*
*├ 1* •  *OWNER*
*├ 2* • *DOWNLOAD*
*├ 3* • *GROUPS*
*├ 4* • *INFO*
*├ 5* • *RANDOM*
*├ 6* • *CONVERT*
*├ 7* • *AI*
*├ 8* • *WALLPAPERS*
*├ 9* • *OTHER*
*├ 10* • *MAIN*
*╰┈───────────────•*

*Reply With Number You want*

> *${config.BOT_NAME}*`;

        const vv = await conn.sendMessage(from, { 
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/zzcckn.jpg' }, 
            caption: menuCaption, 
            contextInfo: {
                mentionedJid: [m.sender], 
                groupMentions: [],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106228@newsletter',
                    newsletterName: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑',
                    serverMessageId: 143
                },
                externalAdReply: { 
                    title: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑', 
                    body: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑', 
                    mediaType: 1, 
                    sourceUrl: "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K", 
                    thumbnailUrl: "https://files.catbox.moe/6oehgp.jpg",
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        const messageID = vv.key.id;

        // Menu data with updated format
        const menuData = {
            '1': {
                content: `*OWNER COMMANDS*
*╭┈───────────────•*
*┋* *.updatecmd*
*┋* *.settings*
*┋* *.owner*
*┋* *.repo*
*┋* *.system*
*┋* *.status*
*┋* *.block*
*┋* *.unblock*
*┋* *.shutdown*
*┋* *.clearchats*
*┋* *.setpp*
*┋* *.broadcast*
*┋* *.jid*
*┋* *.gjid*
*┋* *.restart*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '2': {
                content: `*DOWNLOADER COMMANDS*
*╭┈───────────────•*
*┋* *.facebook [url]*
*┋* *.mediafire [url]*
*┋* *.tiktok [url]*
*┋* *.twitter [url]*
*┋* *.insta [url]*
*┋* *.apk [app]*
*┋* *.img [query]*
*┋* *.tt2 [url]*
*┋* *.pins [url]*
*┋* *.apk2 [app]*
*┋* *.fb2 [url]*
*┋* *.pinterest [url]*
*┋* *.spotify [query]*
*┋* *.play [song]*
*┋* *.play2-10 [song]*
*┋* *.audio [url]*
*┋* *.video [url]*
*┋* *.video2-10 [url]*
*┋* *.ytmp3 [url]*
*┋* *.ytmp4 [url]*
*┋* *.song [name]*
*┋* *.drama [name]*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '3': {
                content: `*GROUP COMMANDS*
*╭┈───────────────•*
*┋* *.grouplink*
*┋* *.kickall*
*┋* *.kickall2*
*┋* *.kickall3*
*┋* *.add @user*
*┋* *.remove @user*
*┋* *.kick @user*
*┋* *.promote @user*
*┋* *.demote @user*
*┋* *.dismiss*
*┋* *.revoke*
*┋* *.mute [time]*
*┋* *.unmute*
*┋* *.lockgc*
*┋* *.unlockgc*
*┋* *.tag @user*
*┋* *.hidetag [msg]*
*┋* *.tagall*
*┋* *.tagadmins*
*┋* *.invite*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '4': {
                content: `*INFO COMMANDS*
*╭┈───────────────•*
*┋* *.menu*
*┋* *.menu2*
*┋* *.menu3*
*┋* *.about*
*┋* *.script*
*┋* *.repo*
*┋* *.alive*
*┋* *.botinfo*
*┋* *.status*
*┋* *.support*
*┋* *.ping*
*┋* *.ping2*
*┋* *.system*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '5': {
                content: `*RANDOM COMMANDS*
*╭┈───────────────•*
*┋* *.king*
*┋* *.dog*
*┋* *.anime*
*┋* *.animegirl*
*┋* *.animegirl1-5*
*┋* *.anime1-5*
*┋* *.foxgirl*
*┋* *.naruto*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '6': {
                content: `*CONVERTER COMMANDS*
*╭┈───────────────•*
*┋* *.sticker [img]*
*┋* *.sticker2 [img]*
*┋* *.emojimix 😎+😂*
*┋* *.take [name,text]*
*┋* *.tomp3 [video]*
*┋* *.fancy [text]*
*┋* *.tts [text]*
*┋* *.trt [text]*
*┋* *.base64 [text]*
*┋* *.unbase64 [text]*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '7': {
                content: `*AI COMMANDS*
*╭┈───────────────•*
*┋* *.ai [query]*
*┋* *.gpt3 [query]*
*┋* *.gpt2 [query]*
*┋* *.gptmini [query]*
*┋* *.gpt [query]*
*┋* *.meta [query]*
*┋* *.imagine [text]*
*┋* *.imagine2 [text]*
*┋* *.blackbox [query]*
*┋* *.luma [query]*
*┋* *.dj [query]*
*┋* *.khan [query]*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '8': {
                content: `*WALLPAPERS COMMANDS*
*╭┈───────────────•*
*┋* *.img*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '9': {
                content: `*OTHER COMMANDS*
*╭┈───────────────•*
*┋* *.timenow*
*┋* *.date*
*┋* *.count [num]*
*┋* *.calculate [expr]*
*┋* *.countx*
*┋* *.flip*
*┋* *.coinflip*
*┋* *.rcolor*
*┋* *.roll*
*┋* *.fact*
*┋* *.define [word]*
*┋* *.news [query]*
*┋* *.movie [name]*
*┋* *.weather [loc]*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '10': {
                content: `*MAIN COMMANDS*
*╭┈───────────────•*
*┋* *.ping*
*┋* *.live*
*┋* *.alive*
*┋* *.runtime*
*┋* *.uptime*
*┋* *.repo*
*┋* *.owner*
*┋* *.menu*
*┋* *.menu2*
*┋* *.restart*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
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
                            await conn.sendMessage(
                                senderID,
                                { 
                                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/6oehgp.jpg' },
                                    caption: selectedMenu.content,
                                    contextInfo: {
                                        mentionedJid: [sender],
                                        forwardingScore: 999,
                                        isForwarded: true
                                    }
                                },
                                { quoted: receivedMsg }
                            );

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
                                text: `*╭┈───────────────•*\n*┋* Invalid Option!\n*┋* Please reply with number 1-10\n*╰┈───────────────•*\n\n> ${config.BOT_NAME}`,
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
                    text: `*╭┈───────────────•*\n*┋* Menu system busy\n*┋* Try again later\n*╰┈───────────────•*\n\n> ${config.BOT_NAME}`,
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
