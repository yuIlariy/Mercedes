const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
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
*├ 1* •  *DOWNLOAD*
*├ 2* • *GROUP*
*├ 3* • *FUN*
*├ 4* • *OWNER*
*├ 5* • *AI*
*├ 6* • *ANIME*
*├ 7* • *CONVERT*
*├ 8* • *OTHER*
*├ 9* • *REACTIONS*
*├ 10* • *MAIN*
*╰┈───────────────•*

*Reply With Number You want*

> *${config.BOT_NAME}*`;

        const vv = await conn.sendMessage(from, { 
            image: { url: config.ALIVE_IMG || 'https://files.catbox.moe/7zfdcq.jpg' }, 
            caption: menuCaption, 
            contextInfo: {
                mentionedJid: [sender], 
                groupMentions: [],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106228@newsletter', 
                    newsletterName: config.BOT_NAME, 
                    serverMessageId: 143
                },
                externalAdReply: { 
                    title: config.BOT_NAME, 
                    body: pushname, 
                    mediaType: 1, 
                    sourceUrl: config.SUPPORT_LINK || "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K", 
                    thumbnailUrl: config.ALIVE_IMG || "https://files.catbox.moe/7zfdcq.jpg",
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        const messageID = vv.key.id;

        // Menu data with your exact style
        const menuData = {
            '1': {
                content: `*DOWNLOADER-CMD*                        
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
*┋* *.darama [name]*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '2': {
                content: `*GROUP-CMD*
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
            '3': {
                content: `*FUN-CMD*
*╭┈───────────────•*
*┋* *.shapar*
*┋* *.rate @user*
*┋* *.insult @user*
*┋* *.hack @user*
*┋* *.ship @user1 @user2*
*┋* *.character*
*┋* *.pickup*
*┋* *.joke*
*┋* *.hrt*
*┋* *.hpy*
*┋* *.syd*
*┋* *.anger*
*┋* *.shy*
*┋* *.kiss*
*┋* *.mon*
*┋* *.cunfuzed*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '4': {
                content: `*OWNER-CMD*
*╭┈───────────────•*
*┋* *.block @user*
*┋* *.unblock @user*
*┋* *.fullpp [img]*
*┋* *.setpp [img]*
*┋* *.restart*
*┋* *.shutdown*
*┋* *.updatecmd*
*┋* *.gjid*
*┋* *.jid @user*
*┋* *.listcmd*
*┋* *.allmenu*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '5': {
                content: `*AI-CMD*
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
            '6': {
                content: `*ANIME-CMD*
*╭┈───────────────•*
*┋* *.fack*
*┋* *.dog*
*┋* *.awoo*
*┋* *.garl*
*┋* *.waifu*
*┋* *.neko*
*┋* *.megnumin*
*┋* *.maid*
*┋* *.loli*
*┋* *.animegirl*
*┋* *.animegirl1-5*
*┋* *.anime1-5*
*┋* *.foxgirl*
*┋* *.naruto*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '7': {
                content: `*CONVERT-CMD*
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
            '8': {
                content: `*OTHER-CMD*
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
            '9': {
                content: `*REACTIONS-CMD*
*╭┈───────────────•*
*┋* *.cuddle @user*
*┋* *.hug @user*
*┋* *.kiss @user*
*┋* *.lick @user*
*┋* *.pat @user*
*┋* *.bully @user*
*┋* *.bonk @user*
*┋* *.yeet @user*
*┋* *.slap @user*
*┋* *.kill @user*
*┋* *.blush @user*
*┋* *.smile @user*
*┋* *.happy @user*
*┋* *.wink @user*
*┋* *.poke @user*
*╰┈───────────────•*

> *${config.BOT_NAME}*`
            },
            '10': {
                content: `*MAIN-CMD*
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
                                    image: { url: config.ALIVE_IMG || 'https://files.catbox.moe/7zfdcq.jpg' },
                                    caption: selectedMenu.content,
                                    contextInfo: {
                                        mentionedJid: [sender],
                                        groupMentions: [],
                                        forwardingScore: 999,
                                        isForwarded: true,
                                        forwardedNewsletterMessageInfo: {
                                            newsletterJid: '120363354023106228@newsletter',
                                            newsletterName: config.BOT_NAME,
                                            serverMessageId: 143
                                        },
                                        externalAdReply: {
                                            title: config.BOT_NAME,
                                            body: pushname,
                                            mediaType: 1,
                                            sourceUrl: config.SUPPORT_LINK || "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K",
                                            thumbnailUrl: config.ALIVE_IMG || "https://files.catbox.moe/7zfdcq.jpg",
                                            renderLargerThumbnail: true,
                                            showAdAttribution: true
                                        }
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
