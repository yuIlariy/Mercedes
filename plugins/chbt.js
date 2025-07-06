const { cmd } = require('../command');
const axios = require('axios');

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

// Listen to all messages
module.exports = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        
        // Skip if message is from the bot itself, is a command, or is not a text message
        if (!m.message || 
            m.key.fromMe || 
            m.message.conversation.startsWith('.') || 
            m.message.conversation.startsWith('!') ||
            m.message.conversation.startsWith('#') ||
            m.message.conversation.startsWith('/')) {
            return;
        }

        const messageText = m.message.conversation;
        const chatId = m.key.remoteJid;

        // Only respond in private chats or when mentioned in groups
        const isGroup = chatId.endsWith('@g.us');
        const isMentioned = isGroup && m.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user.jid);

        if (!isGroup || isMentioned) {
            try {
                // Show "typing" indicator
                await conn.sendPresenceUpdate('composing', chatId);
                
                // Get response from AI (rotating between APIs for better reliability)
                const apis = ['gpt', 'openai', 'deepseek'];
                const randomApi = apis[Math.floor(Math.random() * apis.length)];
                
                const response = await getAIResponse(messageText, randomApi);
                
                if (response) {
                    await conn.sendMessage(chatId, { 
                        text: `🤖 *AI Response:*\n\n${response}` 
                    }, { quoted: m });
                }
            } catch (e) {
                console.error('Error in chatbot response:', e);
            }
        }
    });
};
