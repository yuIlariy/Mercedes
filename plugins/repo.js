const { cmd } = require('../command');
const axios = require('axios');
const moment = require('moment');

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
        const processingMsg = await reply('⏳ Fetching repository data...');

        // Fetch repository data from GitHub API
        const response = await axios.get('https://api.github.com/repos/betingrich3/Mercedes');
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
*│* 🌐 *GitHub URL:* ${repo.html_url}
*│* 📞 *Contact:* https://wa.me/254790375810
*╰┈───────────────•*`;

        // Send the repository information with thumbnail
        await conn.sendMessage(from, { 
            video: { url: 'https://files.catbox.moe/acf262.mp4' },
            caption: pingMessage,
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
                    title: config.BOT_NAME + ' Repo',
                    body: pushname,
                    mediaType: 2, // 2 for video
                    thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg',
                    sourceUrl: config.SUPPORT_LINK || "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error('Repo Command Error:', e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Repository Info Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
