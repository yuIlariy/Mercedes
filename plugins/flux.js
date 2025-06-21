const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

let fluxEnabled = false;

cmd({
    pattern: "flux",
    alias: ["fluxai", "fai"],
    desc: "Toggle Flux AI or generate images/responses",
    category: "ai",
    react: "🌀",
    filename: __filename,
    use: '<on/off> or <prompt>'
}, async (conn, mek, m, { from, sender, reply, args }) => {
    try {
        const input = args.join(' ');

        // Toggle mode
        if (input === 'on') {
            fluxEnabled = true;
            return reply('🌀 Flux AI enabled\nNow I will respond to all messages with AI');
        }
        else if (input === 'off') {
            fluxEnabled = false;
            return reply('🌀 Flux AI disabled');
        }
        else if (!input) {
            return reply(`🌀 Flux AI is currently ${fluxEnabled ? 'ENABLED' : 'DISABLED'}\n\n` +
                        `Usage:\n` +
                        `${config.PREFIX}flux on - Enable auto-reply\n` +
                        `${config.PREFIX}flux off - Disable auto-reply\n` +
                        `${config.PREFIX}flux <prompt> - Generate AI response/image`);
        }

        // Check if prompt should generate image
        const isImagePrompt = input.match(/generate|create|draw|picture|image|photo/img);

        if (isImagePrompt) {
            await reply('🖌️ Generating image...');
            const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(input)}&type=image`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            
            if (response.data?.imageUrl) {
                return conn.sendMessage(from, { 
                    image: { url: response.data.imageUrl },
                    caption: `🖼️ Generated for: ${input}`,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                }, { quoted: mek });
            }
            return reply('❌ Failed to generate image');
        }

        // Text response
        await reply('🌀 Processing your query...');
        const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(input)}`;
        const response = await axios.get(apiUrl, { timeout: 20000 });
        
        const aiResponse = response.data?.result || response.data?.response || response.data;
        return reply(`🌀 *Flux AI Response:*\n\n${aiResponse}\n\n` +
                    `ℹ️ Use *${config.PREFIX}flux on* for auto-reply mode`);

    } catch (e) {
        console.error('Flux AI Error:', e);
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});

// Auto-reply handler
module.exports.init = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!fluxEnabled) return;
        
        const message = messages[0];
        if (!message.message || message.key.fromMe || message.key.remoteJid === 'status@broadcast') return;

        const text = message.message.conversation || 
                    message.message.extendedTextMessage?.text || 
                    message.message.imageMessage?.caption;
        
        if (!text) return;

        try {
            const isImagePrompt = text.match(/generate|create|draw|picture|image|photo/img);
            
            if (isImagePrompt) {
                const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}&type=image`;
                const response = await axios.get(apiUrl, { timeout: 30000 });
                
                if (response.data?.imageUrl) {
                    return conn.sendMessage(message.key.remoteJid, { 
                        image: { url: response.data.imageUrl },
                        caption: `🖼️ Generated for: ${text}`,
                        contextInfo: {
                            mentionedJid: [message.key.participant || message.key.remoteJid],
                            forwardingScore: 999,
                            isForwarded: true
                        }
                    }, { quoted: message });
                }
            }

            // Text response
            const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;
            const response = await axios.get(apiUrl, { timeout: 20000 });
            
            const aiResponse = response.data?.result || response.data?.response || response.data;
            if (aiResponse) {
                await conn.sendMessage(message.key.remoteJid, { 
                    text: `🌀 *Flux AI Reply:*\n\n${aiResponse}\n\n` +
                          `🔹 Use *${config.PREFIX}flux off* to disable`,
                    contextInfo: {
                        mentionedJid: [message.key.participant || message.key.remoteJid],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                }, { quoted: message });
            }
        } catch (e) {
            console.error('Flux Auto-Reply Error:', e);
        }
    });
};
