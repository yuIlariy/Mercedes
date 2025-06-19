const { cmd } = require('../command');
const config = require('../config');
const repoTracker = require('../utils/repoTracker');
const cron = require('node-cron');

// Schedule automatic checks every 6 hours
cron.schedule('0 */6 * * *', async () => {
    const update = await repoTracker.checkForUpdates();
    if (update) {
        // Send update notification to all groups or specific chat
        const updateMsg = `*📦 Repository Update Alert!*\n\n` +
                         `*${config.BOT_NAME}* repository has been updated!\n\n` +
                         `*Commit Message:* ${update.message}\n` +
                         `*Author:* ${update.author}\n` +
                         `*Date:* ${new Date(update.date).toLocaleString()}\n` +
                         `*View Changes:* ${update.url}`;
        
        // You need to implement how to get all groups/chats to notify
        // For example, if you have a database of groups:
        // const groups = await getGroupsFromDatabase();
        // groups.forEach(group => {
        //     conn.sendMessage(group.id, { text: updateMsg });
        // });
    }
});

cmd({
    pattern: "latest",
    alias: ["update", "repo-update"],
    desc: "Check for the latest repository updates",
    category: "info",
    react: "🔄",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await reply("🔄 Checking for repository updates...");
        
        const update = await repoTracker.checkForUpdates();
        if (!update) {
            return reply("✅ Your bot is up-to-date with the latest repository version.");
        }

        const updateMsg = `*📦 Latest Repository Update*\n\n` +
                         `*Commit Message:* ${update.message}\n` +
                         `*Author:* ${update.author}\n` +
                         `*Date:* ${new Date(update.date).toLocaleString()}\n` +
                         `*View Changes:* ${update.url}\n\n` +
                         `Run *${config.PREFIX}update now* to update your bot.`;

        await conn.sendMessage(from, {
            text: updateMsg,
            contextInfo: {
                externalAdReply: {
                    title: `${config.BOT_NAME} Update Available`,
                    body: `New commit: ${update.message.substring(0, 30)}...`,
                    thumbnail: await (await axios.get(`${config.REPO_LINK}/blob/main/.github/logo.png?raw=true`, { responseType: 'arraybuffer' })).data,
                    mediaType: 1,
                    sourceUrl: update.url
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Update check error:", e);
        await reply(`❌ Failed to check updates: ${e.message}`);
    }
});
