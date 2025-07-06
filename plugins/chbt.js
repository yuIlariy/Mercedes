const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

let aiResponderEnabled = true; // Enabled by default

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
            return reply('*Chat-Bot disabled*');
        } 
        else if (action === 'on') {
            if (aiResponderEnabled) return reply('❌ AI responder is already on');
            aiResponderEnabled = true;
            return reply('*Chat-Bot enabled*');
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

// Message handler
module.exports.init = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!aiResponderEnabled) return;
        
        const message = messages[0];
        if (!message.message || 
            message.key.fromMe || 
            message.key.remoteJid === 'status@broadcast' ||
            message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user.id)) return;

        // Get message text
        const text = message.message.conversation || 
                     message.message.extendedTextMessage?.text || 
                     message.message.imageMessage?.caption;
        
        if (!text || text.startsWith(config.PREFIX)) return;

        try {
            const apiUrl = `https://api.giftedtech.web.id/api/ai/groq-beta?apikey=gifted&q=${encodeURIComponent(text)}`;
            
            // Typing indicator
            await conn.sendPresenceUpdate('composing', message.key.remoteJid);
            
            const response = await axios.get(apiUrl, { timeout: 15000 });
            let aiResponse = response.data?.result || response.data?.response || response.data;
            
            if (typeof aiResponse === 'object') {
                aiResponse = JSON.stringify(aiResponse);
            }

            if (aiResponse) {
                // Stop typing indicator
                await conn.sendPresenceUpdate('paused', message.key.remoteJid);
                
                await conn.sendMessage(message.key.remoteJid, { 
                    text: aiResponse,
                    contextInfo: {
                        mentionedJid: [message.key.participant || message.key.remoteJid],
                        forwardingScore: 999,
                        isForwarded: true,
                        externalAdReply: {
                            title: "Mercedes Ai",
                            body: "Made By Marisel",
                            thumbnailUrl: "https://files.catbox.moe/tpzqtm.jpg",
                            sourceUrl: "https://giftedtech.web.id"
                        }
                    }
                }, { quoted: message });
            }
        } catch (e) {
            console.error('AI Response Error:', e);
            await conn.sendPresenceUpdate('paused', message.key.remoteJid);
        }
    });
};
