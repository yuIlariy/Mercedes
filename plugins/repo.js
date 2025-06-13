const { cmd } = require('../command');
const axios = require('axios');
const moment = require('moment');
const config = require('../config');

cmd({
    pattern: "repo",
    alias: ["repository", "mercedes"],
    desc: "Show Mercedes WhatsApp Bot repository information",
    category: "info",
    react: "🫆",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Show loading indicator
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const processingMsg = await reply('*Wait Fetching repository data...*');

        // Fetch repository data from GitHub API
        const response = await axios.get('https://api.github.com/repos/betingrich3/Mercedes', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mercedes-WhatsApp-Bot'
            }
        });
        const repo = response.data;
        
        // Format last updated time
        const lastUpdated = moment(repo.updated_at).fromNow();
        
        // Prepare the repository information message
        const repoInfo = `*╭┈───────────────•*
*〈 Mercedes WhatsApp Bot Repository 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 📦 *Repository:* ${repo.name}
*│  ◦* 📝 *Description:* ${repo.description || 'No description'}
*│  ◦* 👨‍💻 *Owner:* ${repo.owner.login}
*│  ◦* ⭐ *Stars:* ${repo.stargazers_count}
*│  ◦* 🍴 *Forks:* ${repo.forks_count}
*│  ◦* 📂 *Size:* ${(repo.size / 1024).toFixed(2)} MB
*│  ◦* 🏷️ *Language:* ${repo.language || 'Not specified'}
*│  ◦* 🔄 *Last Updated:* ${lastUpdated}
*│  ◦* 🚀 *Watchers:* ${repo.watchers_count}
*│  ◦* 📜 *License:* ${repo.license?.name || 'None'}
*╰┈───────────────•*
*╭┈───────────────•*
*│*  *GitHub URL:https://shorturl.at/tTCPL*
*│*  *Contact:https://shorturl.at/8t937*
*╰┈───────────────•*`;

        // ContextInfo configuration
        const contextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363299029326322@newsletter',
                newsletterName: config.OWNER_NAME || config.BOT_NAME || 'Marisel',
                serverMessageId: 143
            },
            externalAdReply: {
                title: (config.BOT_NAME || 'Mercedes') + ' Repository',
                body: pushname || 'GitHub Repository Info',
                mediaType: 2, // 2 for video
                thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg',
                sourceUrl: config.SUPPORT_LINK || repo.html_url,
                renderLargerThumbnail: true
            }
        };

        // Function to send video with fallback to image
        const sendRepoMedia = async () => {
            try {
                return await conn.sendMessage(from, { 
                    video: { url: 'https://files.catbox.moe/acf262.mp4' },
                    caption: repoInfo, // Fixed: Using repoInfo instead of pingMessage
                    gifPlayback: true,
                    contextInfo: contextInfo
                }, { quoted: mek });
            } catch (videoError) {
                console.log('Video send failed, falling back to image');
                try {
                    return await conn.sendMessage(from, { 
                        image: { url: 'https://files.catbox.moe/tpzqtm.jpg' },
                        caption: repoInfo,
                        contextInfo: contextInfo
                    }, { quoted: mek });
                } catch (imageError) {
                    console.log('Image send failed, falling back to text');
                    return await conn.sendMessage(from, { 
                        text: repoInfo,
                        contextInfo: contextInfo
                    }, { quoted: mek });
                }
            }
        };

        // Execute the send function
        await sendRepoMedia();

    } catch (e) {
        console.error('Repo Command Error:', e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Repository Info Error!\n*┋* ${e.message}\n*┋* Please try again later\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: config.OWNER_NAME || config.BOT_NAME || 'Marisel',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
    }
});
