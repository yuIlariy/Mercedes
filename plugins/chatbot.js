const axios = require('axios');
const fs = require('fs');

// Function to handle AI responses
async function getAIResponse(message, apiType = 'gpt') {
    try {
        let apiUrl;
        
        switch(apiType) {
            case 'gpt':
                apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(message)}`;
                break;
            case 'openai':
                apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(message)}`;
                break;
            case 'deepseek':
                apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(message)}`;
                break;
            default:
                apiUrl = `https://api.giftedtech.web.id/api/ai/groq-beta?apikey=gifted&q=${encodeURIComponent(message)}`;
        }

        const { data } = await axios.get(apiUrl);

        if (apiType === 'gpt' && data?.message) return data.message;
        if (apiType === 'openai' && data?.result) return data.result;
        if (apiType === 'deepseek' && data?.answer) return data.answer;

        return null;
    } catch (e) {
        console.error(`Error in ${apiType} API call:`, e);
        return null;
    }
}

// Chatbot configuration
const chatbotConfig = {
    enabled: true, // Set to false to disable the chatbot
    respondInGroups: true, // Set to true to respond in group chats
    respondToMentions: true, // Set to true to respond when bot is mentioned in groups
    cooldown: 3000, // 3 seconds cooldown between responses per user
    typingDelay: 1000, // 1 second typing indicator
    apis: ['gpt', 'openai', 'deepseek'], // APIs to rotate between
    blacklist: JSON.parse(fs.readFileSync('./lib/ban.json', 'utf-8') || '[]') // Banned users
};

// User cooldown tracking
const userCooldowns = new Map();

module.exports = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!chatbotConfig.enabled) return;
        
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        // Get message text
        const messageText = m.message.conversation || 
                          (m.message.extendedTextMessage && m.message.extendedTextMessage.text) || '';
        
        if (!messageText.trim()) return;

        const chatId = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const isMentioned = isGroup && 
                          m.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user.id);

        // Check if user is blacklisted
        if (chatbotConfig.blacklist.includes(sender)) return;

        // Check cooldown
        const now = Date.now();
        if (userCooldowns.has(sender) && now - userCooldowns.get(sender) < chatbotConfig.cooldown) {
            return;
        }

        // Determine if we should respond
        let shouldRespond = false;
        
        if (!isGroup) {
            // Always respond in private chats
            shouldRespond = true;
        } else if (isGroup) {
            // Group chat rules
            if (chatbotConfig.respondInGroups) {
                shouldRespond = true;
            } else if (chatbotConfig.respondToMentions && isMentioned) {
                shouldRespond = true;
            }
        }

        if (!shouldRespond) return;

        try {
            // Update cooldown
            userCooldowns.set(sender, now);

            // Show typing indicator
            await conn.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, chatbotConfig.typingDelay));

            // Get response from AI (rotating between APIs)
            const randomApi = chatbotConfig.apis[Math.floor(Math.random() * chatbotConfig.apis.length)];
            const response = await getAIResponse(messageText, randomApi);
            
            if (response) {
                await conn.sendMessage(chatId, { 
                    text: `🤖 *AI Response:*\n\n${response}`,
                    mentions: isGroup ? [sender] : []
                }, { quoted: m });
            }
        } catch (e) {
            console.error('Error in chatbot response:', e);
        }
    });

    // Clean up cooldown map periodically
    setInterval(() => {
        const now = Date.now();
        for (const [user, timestamp] of userCooldowns.entries()) {
            if (now - timestamp > chatbotConfig.cooldown * 2) {
                userCooldowns.delete(user);
            }
        }
    }, 60000); // Every minute
};
