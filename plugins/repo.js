const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

cmd({
    pattern: "repo",
    alias: ["sc", "code"],
    desc: "Show detailed repository information with video",
    category: "info",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Extract owner and repo name from the URL
        const repoUrl = config.REPO_LINK;
        const matches = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!matches) return reply("❌ Invalid repository URL in config");
        
        const [_, owner, repo] = matches;
        const apiUrl = `https://api.github.com/repos/betingrich3/Mercedes`;

        // Fetch repository data
        const { data } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': `${config.BOT_NAME}-WhatsApp-Bot`
            }
        });

        // Format dates
        const lastUpdated = new Date(data.updated_at).toLocaleDateString();
        const createdAt = new Date(data.created_at).toLocaleDateString();

        // Create repository info message
        const repoInfo = `*╭┈───────────────•*
*〈 ${config.BOT_NAME} Repository 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 📦 *Repository:* ${data.full_name}
*│  ◦* 🌟 *Stars:* ${data.stargazers_count}
*│  ◦* 🍴 *Forks:* ${data.forks_count}
*│  ◦* ⚠️ *Issues:* ${data.open_issues_count}
*│  ◦* 📝 *License:* ${data.license?.name || 'None'}
*│  ◦* 📅 *Created:* ${createdAt}
*│  ◦* 🔄 *Updated:* ${lastUpdated}
*│  ◦* 👨‍💻 *Owner:* ${data.owner.login}
*│  ◦* ⚙️ *Language:* ${data.language}
*╰┈───────────────•*`;

        // Try sending as video first, fallback to text if fails
        try {
            await conn.sendMessage(from, { 
                video: { url: 'https://files.catbox.moe/6zh63g.mp4' },
                caption: repoInfo,
                gifPlayback: true
            }, { quoted: mek });
        } catch (videoError) {
            console.log("Video send failed, sending text only");
            await conn.sendMessage(from, { 
                text: repoInfo,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: `${config.BOT_NAME} Repository`,
                        body: `Click to visit ${data.full_name}`,
                        mediaType: 1,
                        thumbnailUrl: data.owner.avatar_url,
                        sourceUrl: repoUrl
                    }
                }
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("Repo Error:", e);
        await reply(`*╭┈───────────────•*\n*┋* Repo Error!\n*┋* ${e.message}\n*╰┈───────────────•*`);
    }
});
