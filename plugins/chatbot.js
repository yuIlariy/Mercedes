const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

let chatbotEnabled = false;
let currentAI = 'gpt3'; // Default AI
const aiEndpoints = {
    gpt3: 'https://apis.davidcyriltech.my.id/ai/gpt3',
    metaai: 'https://apis.davidcyriltech.my.id/ai/metaai',
    deepseek: 'https://apis.davidcyriltech.my.id/ai/deepseek-v3'
};

cmd({
    pattern: "chatbot",
    alias: ["ai", "bot"],
    desc: "Toggle chatbot or change AI model",
    category: "utility",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
    try {
        const [action, aiModel] = args;
        
        if (aiModel && Object.keys(aiEndpoints).includes(aiModel.toLowerCase())) {
            currentAI = aiModel.toLowerCase();
            return reply(`✅ AI model switched to ${currentAI}`);
        }

        if (action === 'on') {
            if (chatbotEnabled) return reply('❌ Chatbot is already enabled');
            chatbotEnabled = true;
            return reply(`✅ Chatbot enabled\nCurrent AI: ${currentAI}\nBot will now auto-reply to all messages`);
        } 
        else if (action === 'off') {
            if (!chatbotEnabled) return reply('❌ Chatbot is already disabled');
            chatbotEnabled = false;
            return reply('✅ Chatbot disabled');
        }
        else {
            return reply(`⚙️ Chatbot Status: ${chatbotEnabled ? 'ON' : 'OFF'}\n` +
                        `🤖 Current AI: ${currentAI}\n` +
                        `🔧 Available AIs: ${Object.keys(aiEndpoints).join(', ')}\n\n` +
                        `📌 Usage:\n` +
                        `${config.PREFIX}chatbot on - Enable auto-reply\n` +
                        `${config.PREFIX}chatbot off - Disable auto-reply\n` +
                        `${config.PREFIX}chatbot switch [ai] - Change AI model`);
        }
    } catch (e) {
        console.error('Chatbot Command Error:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

module.exports.init = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!chatbotEnabled) return;
        
        const message = messages[0];
        if (!message.message || message.key.fromMe || message.key.remoteJid === 'status@broadcast') return;

        const text = message.message.conversation || 
                    message.message.extendedTextMessage?.text || 
                    message.message.imageMessage?.caption;
        
        if (!text) return;

        try {
            const startTime = Date.now();
            const apiUrl = `${aiEndpoints[currentAI]}?text=${encodeURIComponent(text)}`;
            const response = await axios.get(apiUrl, { timeout: 10000 });
            
            let aiResponse = response.data?.result || response.data?.response || response.data;
            if (typeof aiResponse === 'object') {
                aiResponse = JSON.stringify(aiResponse, null, 2);
            }

            if (aiResponse) {
                await conn.sendMessage(message.key.remoteJid, { 
                    text: `💡 ${aiResponse}\n\n⏱️ ${Date.now() - startTime}ms | 🤖 ${currentAI}`,
                    contextInfo: {
                        mentionedJid: [message.key.participant || message.key.remoteJid],
                        forwardingScore: 999,
                        isForwarded: true,
                        externalAdReply: {
                            title: `${config.BOT_NAME} AI`,
                            body: "Made By Marisel",
                            thumbnailUrl: "https://files.catbox.moe/tpzqtm.jpg",
                            sourceUrl: "https://github.com/betingrich3/Mercedes"
                        }
                    }
                }, { quoted: message });
            }
        } catch (e) {
            console.error('AI API Error:', e);
            await conn.sendMessage(message.key.remoteJid, { 
                text: "⚠️ Failed to get AI response. Please try again later.",
                contextInfo: { mentionedJid: [message.key.participant] }
            }, { quoted: message });
        }
    });
};
