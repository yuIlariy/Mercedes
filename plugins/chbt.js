const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

let aiResponderEnabled = true; // Enabled by default

// Command to toggle AI responder on/off and check status
cmd({
    pattern: "chatbot",
    alias: ["aichat"],
    desc: "Toggle AI auto-responder",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const action = args[0]?.toLowerCase();

        if (action === 'off') {
            if (!aiResponderEnabled) return reply('❌ AI responder is already off');
            aiResponderEnabled = false;
            return reply('✅ AI auto-responder disabled');
        } 
        else if (action === 'on') {
            if (aiResponderEnabled) return reply('❌ AI responder is already on');
            aiResponderEnabled = true;
            return reply('✅ AI auto-responder enabled');
        }
        else {
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

// Message handler initialization
module.exports.init = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!aiResponderEnabled) return; // Responder disabled, do nothing

        const message = messages[0];
        if (!message.message) return; // No message content

        // Ignore messages sent by the bot itself
        if (message.key.fromMe) return;

        // Ignore status broadcast messages
        if (message.key.remoteJid === 'status@broadcast') return;

        // Extract the bot's own ID for mention checks
        const botId = conn.user.id;

        // Check if message is a group message
        const isGroup = message.key.remoteJid.endsWith('@g.us');

        // Determine if the bot is mentioned in the message (for groups)
        const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        // Only respond if:
        // - It's a private chat (not group), OR
        // - The bot is mentioned in a group message
        if (isGroup && !mentionedJids.includes(botId)) {
            // Not mentioned in group, ignore
            return;
        }

        // Extract text from various message types
        let text = '';
        if (message.message.conversation) {
            text = message.message.conversation;
        } else if (message.message.extendedTextMessage?.text) {
            text = message.message.extendedTextMessage.text;
        } else if (message.message.imageMessage?.caption) {
            text = message.message.imageMessage.caption;
        } else if (message.message.videoMessage?.caption) {
            text = message.message.videoMessage.caption;
        } else if (message.message.buttonsResponseMessage?.selectedButtonId) {
            text = message.message.buttonsResponseMessage.selectedButtonId;
        } else if (message.message.listResponseMessage?.singleSelectReply?.selectedRowId) {
            text = message.message.listResponseMessage.singleSelectReply.selectedRowId;
        }

        if (!text) return; // No text to process

        // Ignore messages that start with the command prefix (to avoid loops)
        if (text.startsWith(config.PREFIX)) return;

        console.log(`[AI Responder] Received message: "${text}" from ${message.key.remoteJid}`);

        try {
            const apiUrl = `https://api.giftedtech.web.id/api/ai/groq-beta?apikey=gifted&q=${encodeURIComponent(text)}`;

            // Send typing indicator
            await conn.sendPresenceUpdate('composing', message.key.remoteJid);

            // Call AI API with 15 seconds timeout
            const response = await axios.get(apiUrl, { timeout: 15000 });

            let aiResponse = response.data?.result || response.data?.response || response.data;

            // If AI response is an object, stringify it
            if (typeof aiResponse === 'object') {
                aiResponse = JSON.stringify(aiResponse, null, 2);
            }

            if (aiResponse && aiResponse.trim().length > 0) {
                // Stop typing indicator before sending message
                await conn.sendPresenceUpdate('paused', message.key.remoteJid);

                // Send AI response with context info and mention the sender
                await conn.sendMessage(message.key.remoteJid, {
                    text: aiResponse,
                    contextInfo: {
                        mentionedJid: [message.key.participant || message.key.remoteJid],
                        forwardingScore: 999,
                        isForwarded: true,
                        externalAdReply: {
                            title: "AI Response",
                            body: "Powered by Groq API",
                            thumbnailUrl: "https://files.catbox.moe/tpzqtm.jpg",
                            sourceUrl: "https://giftedtech.web.id"
                        }
                    }
                }, { quoted: message });
            } else {
                // No valid response from API
                await conn.sendPresenceUpdate('paused', message.key.remoteJid);
                console.log('[AI Responder] API returned empty response.');
            }
        } catch (error) {
            console.error('[AI Responder] Error fetching AI response:', error.message);
            try {
                await conn.sendPresenceUpdate('paused', message.key.remoteJid);
            } catch {}
        }
    });
};
