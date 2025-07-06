const axios = require('axios');
const fs = require('fs');

// Chatbot configuration
const config = {
    enabled: true,
    respondInGroups: false,
    respondToMentions: true,
    cooldown: 3000, // 3 seconds cooldown
    typingDelay: 1000, // 1 second typing indicator
    apiUrl: 'https://api.giftedtech.web.id/api/ai/groq-beta',
    apikey: 'gifted'
};

// User cooldown tracking
const userCooldowns = new Map();

async function getAIResponse(prompt) {
    try {
        const response = await axios.get(`${config.apiUrl}?apikey=${config.apikey}&q=${encodeURIComponent(prompt)}`);
        return response.data?.result || response.data?.response || "I couldn't generate a response.";
    } catch (e) {
        console.error('AI API Error:', e.message);
        return null;
    }
}

module.exports = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!config.enabled) return;
        
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        // Get message text
        const messageText = m.message.conversation || 
                          (m.message.extendedTextMessage?.text) || '';
        
        if (!messageText.trim()) return;

        const chatId = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const isMentioned = isGroup && 
                          m.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user.id);

        // Check cooldown
        const now = Date.now();
        if (userCooldowns.has(sender) && now - userCooldowns.get(sender) < config.cooldown) {
            return;
        }

        // Determine response rules
        let shouldRespond = false;
        
        if (!isGroup) {
            shouldRespond = true; // Always respond in private
        } else if (config.respondInGroups || (config.respondToMentions && isMentioned)) {
            shouldRespond = true;
        }

        if (!shouldRespond) return;

        try {
            // Update cooldown
            userCooldowns.set(sender, now);

            // Show typing indicator
            await conn.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, config.typingDelay));

            // Get AI response
            const response = await getAIResponse(messageText);
            
            if (response) {
                await conn.sendMessage(chatId, { 
                    text: `🤖 *AI Response:*\n\n${response}`,
                    mentions: isGroup ? [sender] : []
                }, { quoted: m });
            }
        } catch (e) {
            console.error('Chatbot error:', e);
        }
    });

    // Clean up cooldown map periodically
    setInterval(() => {
        const now = Date.now();
        for (const [user, timestamp] of userCooldowns.entries()) {
            if (now - timestamp > config.cooldown * 2) {
                userCooldowns.delete(user);
            }
        }
    }, 60000);
};
