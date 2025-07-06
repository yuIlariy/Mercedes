const axios = require('axios');
const config = require('../config'); // Ensure config.PREFIX is set

let aiResponderEnabled = true; // Default: ON

// Toggle command for chatbot
const { cmd } = require('../command');
cmd({
    pattern: "chatbot",
    alias: ["airesponder"],
    desc: "Toggle AI auto-responder",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        const action = args[0]?.toLowerCase();
        if (action === 'off') {
            if (!aiResponderEnabled) return reply('❌ AI responder is already off');
            aiResponderEnabled = false;
            return reply('✅ AI auto-responder disabled');
        } else if (action === 'on') {
            if (aiResponderEnabled) return reply('❌ AI responder is already on');
            aiResponderEnabled = true;
            return reply('✅ AI auto-responder enabled');
        } else {
            return reply(`⚙️ AI Responder Status: ${aiResponderEnabled ? 'ON' : 'OFF'}\n\n` +
                `Usage:\n` +
                `${config.PREFIX}chatbot on - Enable AI responses\n` +
                `${config.PREFIX}chatbot off - Disable AI responses`);
        }
    } catch (e) {
        console.error('AI Responder Command Error:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

// Message handler for automatic replies
module.exports.init = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!aiResponderEnabled) return;
        const message = messages[0];
        if (!message.message) return;
        if (message.key.fromMe) return;
        if (message.key.remoteJid === 'status@broadcast') return;

        const botId = conn.user.id;
        const isGroup = message.key.remoteJid.endsWith('@g.us');
        const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        // Only respond if:
        // - Private chat, or
        // - Bot is mentioned in group
        if (isGroup && !mentionedJids.includes(botId)) return;

        // Extract text from various message types
        let text = '';
        if (message.message.conversation) text = message.message.conversation;
        else if (message.message.extendedTextMessage?.text) text = message.message.extendedTextMessage.text;
        else if (message.message.imageMessage?.caption) text = message.message.imageMessage.caption;
        else if (message.message.videoMessage?.caption) text = message.message.videoMessage.caption;

        if (!text) return;

        // Ignore commands (messages starting with prefix)
        if (text.startsWith(config.PREFIX)) return;

        try {
            // Use the same API as your .ai command
            const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(text)}`;
            await conn.sendPresenceUpdate('composing', message.key.remoteJid);

            const { data } = await axios.get(apiUrl, { timeout: 15000 });
            let aiResponse = data?.message;

            if (!aiResponse || !aiResponse.trim()) {
                await conn.sendPresenceUpdate('paused', message.key.remoteJid);
                return;
            }

            await conn.sendPresenceUpdate('paused', message.key.remoteJid);
            await conn.sendMessage(message.key.remoteJid, {
                text: `🤖 *AI Response:*\n\n${aiResponse}`,
                contextInfo: {
                    mentionedJid: [message.key.participant || message.key.remoteJid],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "AI Response",
                        body: "Powered by GPT",
                        thumbnailUrl: "https://files.catbox.moe/tpzqtm.jpg",
                        sourceUrl: "https://lance-frank-asta.onrender.com"
                    }
                }
            }, { quoted: message });
        } catch (e) {
            console.error('AI Auto-Responder Error:', e.message);
            try { await conn.sendPresenceUpdate('paused', message.key.remoteJid); } catch {}
        }
    });
};
    
