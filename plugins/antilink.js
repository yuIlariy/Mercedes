const { cmd } = require('../command');
const config = require('../config');

// Store warning counts per user per group
const linkWarnings = new Map();

cmd({
    pattern: "antilink",
    alias: ["linkguard"],
    desc: "Enable/disable link protection in groups",
    category: "moderation",
    react: "🔗",
    filename: __filename,
    use: '<on/off>'
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups");
        if (!isBotAdmins) return reply("❌ I need to be admin to control link protection");

        const action = m.args[0]?.toLowerCase();
        
        if (action === 'on') {
            if (conn.antilinkGroups?.has(from)) return reply("✅ Antilink is already enabled");
            conn.antilinkGroups = conn.antilinkGroups || new Set();
            conn.antilinkGroups.add(from);
            return reply("🔗 *Antilink Activated*\n\nNow deleting links sent by non-admins with warnings");
        } 
        else if (action === 'off') {
            if (!conn.antilinkGroups?.has(from)) return reply("✅ Antilink is already disabled");
            conn.antilinkGroups.delete(from);
            return reply("🔗 *Antilink Deactivated*\n\nLinks are now allowed from all members");
        }
        else {
            return reply(`⚙️ *Antilink Status:* ${conn.antilinkGroups?.has(from) ? 'ON' : 'OFF'}\n\n` +
                        `Usage:\n` +
                        `${config.PREFIX}antilink on - Enable protection\n` +
                        `${config.PREFIX}antilink off - Disable protection`);
        }
    } catch (e) {
        console.error('Antilink Command Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

// Initialize if not exists
if (!conn.antilinkGroups) conn.antilinkGroups = new Set();

// Message handler
module.exports.init = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message.message || message.key.fromMe) return;

        const from = message.key.remoteJid;
        const sender = message.key.participant || from;
        const isGroup = from.endsWith('@g.us');
        
        // Only proceed if antilink is enabled for this group
        if (!isGroup || !conn.antilinkGroups?.has(from)) return;

        try {
            // Check if sender is admin
            const metadata = await conn.groupMetadata(from);
            const isAdmin = metadata.participants.find(p => p.id === sender)?.admin;

            if (isAdmin) return; // Admins can send links

            // Detect links in message
            const text = message.message.conversation || 
                         message.message.extendedTextMessage?.text || 
                         message.message.imageMessage?.caption || '';
            
            const linkRegex = /https?:\/\/[^\s]+/gi;
            const hasLinks = linkRegex.test(text);

            if (!hasLinks) return;

            // Get current warnings
            const warningKey = `${from}:${sender}`;
            const warnings = linkWarnings.get(warningKey) || 0;

            // Delete the message containing links
            await conn.sendMessage(from, { 
                delete: message.key 
            });

            if (warnings >= 2) { // 3rd offense - remove user
                await conn.groupParticipantsUpdate(from, [sender], 'remove');
                linkWarnings.delete(warningKey);
                return conn.sendMessage(from, { 
                    text: `🚷 @${sender.split('@')[0]} has been removed for repeatedly sending links`,
                    mentions: [sender]
                });
            }

            // Issue warning
            const newWarnings = warnings + 1;
            linkWarnings.set(warningKey, newWarnings);

            const warnMsg = `⚠️ *Link Warning* (${newWarnings}/3)\n` +
                           `@${sender.split('@')[0]}, links are not allowed!\n` +
                           `Next violation will ${newWarnings === 1 ? 'warn again' : 'result in removal'}`;

            await conn.sendMessage(from, { 
                text: warnMsg,
                mentions: [sender]
            });

        } catch (e) {
            console.error('Antilink Handler Error:', e);
        }
    });

    // Clear warnings when someone leaves the group
    conn.ev.on('group-participants.update', (update) => {
        if (update.action === 'remove') {
            const participants = update.participants.map(p => p.id);
            for (const [key] of linkWarnings) {
                const [groupId, userId] = key.split(':');
                if (groupId === update.id && participants.includes(userId)) {
                    linkWarnings.delete(key);
                }
            }
        }
    });
};
