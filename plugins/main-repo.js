const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "repo",
    desc: "Show information about the Mercedes repository",
    category: "info",
    react: "♥️",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply, sender }) => {
    try {
        // Fetch repository data from GitHub API
        const repoUrl = 'https://api.github.com/repos/betingrich4/Mercedes';
        const response = await axios.get(repoUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const repoData = response.data;

        // Format last update date
        const lastUpdate = new Date(repoData.pushed_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Construct repository info caption
        const repoCaption = `*╭┈───────────────•*
*〈 Repository Info*   
*╰┈───────────────•*
*╭┈───────────────•*
*┋*  ◦* ʀᴇᴘᴏ : *${repoData.name}*
*┋*  ◦* ᴏᴡɴᴇʀ : *${repoData.owner.login}*
*┋*  ◦* ꜱᴛᴀʀꜱ : *${repoData.stargazers_count}*
*┋*  ◦* ғᴏʀᴋꜱ : *${repoData.forks_count}*
*┋*  ◦* ʟᴀꜱᴛ ᴜᴘᴅᴀᴛᴇ : *${lastUpdate}*
*┋*  ◦* ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ : *${repoData.description || 'No description available'}*
*╰┈───────────────•*
*◆─〈 ✦${config.BOT_NAME}✦ 〉─◆*

> *${config.BOT_NAME}*`;

        const contextInfo = {
            mentionedJid: [sender],
            groupMentions: [],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363299029326322@newsletter',
                newsletterName: "𝖒𝖆𝖗𝖎𝖘𝖊𝖑",
                serverMessageId: 999
            },
            externalAdReply: {
                title: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑',
                body: `${pushname}`,
                mediaType: 1,
                sourceUrl: "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K",
                thumbnailUrl: "https://files.catbox.moe/tpzqtm.jpg",
                renderLargerThumbnail: true,
                showAdAttribution: true
            }
        };

        // Function to send repo info with image
        const sendRepoImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg' },
                        caption: repoCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: repoCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Send image with timeout
        try {
            await Promise.race([
                sendRepoImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Repo info send error:', e);
            await conn.sendMessage(
                from,
                { text: repoCaption, contextInfo: contextInfo },
                { quoted: mek }
            );
        }

    } catch (e) {
        console.error('Repo Error:', e);
        try {
            await conn.sendMessage(
                from,
                {
                    text: `❌ Unable to fetch repository info. Please try again later.\n\n> ${config.BOT_NAME}`,
                    contextInfo: contextInfo
                },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
