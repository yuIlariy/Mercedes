const { cmd } = require('../command');
const config = require('../config');
const repoTracker = require('../assets/lib/repoTracker'); // Adjust path as needed
const { execSync } = require('child_process');
const axios = require('axios');

// Automatic update check every 6 hours
const cron = require('node-cron');
cron.schedule('0 */6 * * *', async () => {
    try {
        const update = await repoTracker.checkForUpdates();
        if (update) {
            const notifyMessage = `🚀 *${config.BOT_NAME} Update Available!*\n\n` +
                                `📝 *Commit:* ${update.message}\n` +
                                `👤 *Author:* ${update.author}\n` +
                                `⏰ *Date:* ${new Date(update.date).toLocaleString()}\n\n` +
                                `Run *${config.PREFIX}update now* to upgrade your bot!`;
            
            // Implement your notification logic here
            // Example: Send to all registered groups/chats
            // notifyGroups(notifyMessage);
        }
    } catch (e) {
        console.error('Auto-update check failed:', e);
    }
});

cmd({
    pattern: "update",
    alias: ["upgrade", "gitpull"],
    desc: "Manage bot updates",
    category: "system",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply, prefix, sender, isAdmin }) => {
    try {
        const [_, action] = m.text.split(' ');

        // Check update command
        if (!action || action === 'check') {
            await reply("🔍 Checking for updates...");
            const update = await repoTracker.checkForUpdates();
            
            if (!update) {
                return reply("*Your bot is already running the latest version!*");
            }

            const updateInfo = `📦 *New Update Available!*\n\n` +
                             `📌 *Commit:* ${update.message}\n` +
                             `👨‍💻 *Author:* ${update.author}\n` +
                             `📅 *Date:* ${new Date(update.date).toLocaleString()}\n\n` +
                             `Use *${prefix}update now* to upgrade`;

            return conn.sendMessage(from, { 
                text: updateInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `${config.BOT_NAME} Update`,
                        body: "Click to view changes",
                        thumbnail: (await axios.get(update.url.replace('github.com', 'github.com/identicons'), { responseType: 'arraybuffer' })).data,
                        mediaType: 1,
                        sourceUrl: update.url
                    }
                }
            }, { quoted: mek });
        }

        // Update now command
        if (action === 'now') {
            if (!isAdmin) return reply("❌ This command is only for admins!");

            await reply("⚡ Starting update process...");
            
            // 1. Git pull
            await reply("🔄 Pulling latest changes...");
            const pullOutput = execSync('git pull', { encoding: 'utf-8' });
            
            // 2. Install dependencies
            await reply("📦 Installing dependencies...");
            const installOutput = execSync('npm install', { encoding: 'utf-8' });
            
            // 3. Build if needed
            // execSync('npm run build', { encoding: 'utf-8' });
            
            const successMsg = `✅ *Update Successful!*\n\n` +
                              `Changes:\n${pullOutput.substring(0, 200)}...\n\n` +
                              `The bot will restart automatically.`;
            
            await reply(successMsg);
            
            // Restart the bot
            setTimeout(() => process.exit(0), 3000);
            return;
        }

        // Show help
        return reply(`🔄 *Update Help*\n\n` +
                    `• *${prefix}update check* - Check for updates\n` +
                    `• *${prefix}update now* - Install updates (Admin only)\n\n` +
                    `Current Version: ${require('../package.json').version}`);
        
    } catch (e) {
        console.error('Update error:', e);
        return reply(`❌ Update failed: ${e.message}`);
    }
});
