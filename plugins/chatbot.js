const axios = require('axios');
const fs = require('fs');

// Configuration
const config = {
    enabled: true,
    respondInGroups: false,
    respondToMentions: true,
    cooldown: 3000,
    typingDelay: 1000,
    apiUrl: 'https://api.paxsenix.biz.id/ai/gemini-realtime',
    sessionId: 'ZXlKaklqb2lZMTg0T0RKall6TTNNek13TVdFNE1qazNJaXdpY2lJNkluSmZNbU01TUdGa05ETmtNVFF3WmpNNU5pSXNJbU5vSWpvaWNtTmZZVE16TURWaE1qTmpNR1ExTnpObFl5Sjk',
    branding: {
        name: 'Marisel',
        owner: 'Lord Joel',
        numbers: [
            '+254740007567',
            '+255781144539',
            '+255767570963'
        ],
        thumbnail: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/main/mydata/media/thumbnail.jpg',
        github: 'https://github.com/joeljamestech/JOEL-XMD'
    },
    replacements: [
        { pattern: /I am a large language model, trained by Google\.?/gi, replacement: "I am Joel XMD bot, trained by Lord Joel." },
        { pattern: /by Google/gi, replacement: "by Lord Joel" },
        { pattern: /large language model/gi, replacement: "Joel XMD bot" },
        { pattern: /\bGemini\b/gi, replacement: "Joel AI" },
        { pattern: /\bI'm Gemini\b/gi, replacement: "I'm Joel AI" },
        { pattern: /Yes, I am Gemini\./gi, replacement: "I'm Joel XMD bot developed by Lord Joel." },
        { pattern: /I do not have an owner or a phone number/gi, replacement: "Here are my owner WhatsApp numbers: \n${config.branding.numbers.join('\n')}" }
    ]
};

// User cooldown tracking
const userCooldowns = new Map();

async function getAIResponse(prompt) {
    try {
        const response = await axios.get(`${config.apiUrl}?text=${encodeURIComponent(prompt)}&session_id=${config.sessionId}`);
        let answer = response.data?.message || 'Oops! I couldn\'t quite catch that 😅. Can you try again?';
        
        // Apply branding replacements
        config.replacements.forEach(replace => {
            answer = answer.replace(replace.pattern, replace.replacement);
        });
        
        // Inject owner numbers dynamically
        answer = answer.replace('${config.branding.numbers.join(\'\n\')}', config.branding.numbers.join('\n'));
        
        return answer;
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
                    text: response,
                    contextInfo: {
                        externalAdReply: {
                            title: config.branding.name,
                            body: 'Chat with Joel assistant anytime',
                            thumbnailUrl: config.branding.thumbnail,
                            sourceUrl: config.branding.github,
                            mediaType: 1,
                            renderLargerThumbnail: false,
                        }
                    },
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
