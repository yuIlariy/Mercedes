const { cmd } = require('../command');

cmd({
    pattern: "delete",
    alias: ["trash", "remove"],
    desc: "Delete the replied/tagged message (for everyone)",
    category: "utility",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, quoted }) => {
    try {
        if (!m.quoted && !mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            return reply("*Please reply to or tag a message to delete.*");
        }

        const key = {
            remoteJid: from,
            fromMe: m.quoted?.key?.fromMe || false,
            id: m.quoted?.key?.id || mek.message.extendedTextMessage.contextInfo.stanzaId,
            participant: m.quoted?.key?.participant || sender
        };

        // Delete the message for everyone
        await conn.sendMessage(from, { delete: key });

        // Confirm deletion
        await conn.sendMessage(from, { 
            text: "*Message deleted successfully!*",
            contextInfo: {
                mentionedJid: [sender]
            }
        }, { quoted: m });

    } catch (e) {
        console.error('Delete Command Error:', e);
        await conn.sendMessage(from, { 
            text: `❌ Failed to delete message: ${e.message}`,
            contextInfo: {
                mentionedJid: [sender]
            }
        }, { quoted: m });
    }
});
