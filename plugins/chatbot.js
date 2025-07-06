import config from '../../config.cjs';
import fetch from 'node-fetch';

const chatbotCommand = async (m, Matrix) => {
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || null;
    const senderId = m.key.remoteJid;
    const senderName = m.pushName || `User ${senderId}`;
    const ownerNumber = `${config.OWNER_NUMBER}@s.whatsapp.net`;

    const isChatbotEnabled = config.CHAT_BOT ?? true;
    const chatbotMode = config.CHAT_BOT_MODE ?? 'public';
    const privateUsers = new Set(config.PRIVATE_USERS || []);

    if (!isChatbotEnabled) return;
    if (senderId === ownerNumber) return;
    if (senderId.endsWith('@g.us') || senderId === 'status@broadcast' || senderId.includes('@newsletter')) return;
    if (chatbotMode === 'private' && !privateUsers.has(senderId)) return;
    if (!text) return;

    try {
        const response = await fetch(`https://api.paxsenix.biz.id/ai/gemini-realtime?text=${encodeURIComponent(text)}&session_id=ZXlKaklqb2lZMTg0T0RKall6TTNNek13TVdFNE1qazNJaXdpY2lJNkluSmZNbU01TUdGa05ETmtNVFF3WmpNNU5pSXNJbU5vSWpvaWNtTmZZVE16TURWaE1qTmpNR1ExTnpObFl5Sjk`);
        if (!response.ok) return;

        let answer = (await response.json()).message || 'Oops! I couldn't quite catch that 😅. Can you try again?';

        answer = answer
            .replace(/I am a large language model, trained by Google\.?/gi, "I am Joel XMD bot, trained by Lord Joel.")
            .replace(/by Google/gi, "by Lord Joel")
            .replace(/large language model/gi, "Joel XMD bot")
            .replace(/\bGemini\b/gi, "Joel AI")
            .replace(/\bI'm Gemini\b/gi, "I'm Joel AI")
            .replace(/Yes, I am Gemini\./gi, "I'm Joel XMD bot developed by Lord Joel.")
            .replace(/I do not have an owner or a phone number/gi, 
                    `Here are my owner WhatsApp numbers: \njoeljamestech +255714595878, \njoeljamestech2 +255781144539, \njoeljamestech3 +255767570963`);

        await Matrix.sendMessage(senderId, {
            text: answer,
            contextInfo: {
                externalAdReply: {
                    title: 'JOEL XMD AI',
                    body: 'Chat with joel assistant anytime',
                    thumbnailUrl: "https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/main/mydata/media/thumbnail.jpg",
                    sourceUrl: "https://github.com/joeljamestech/JOEL-XMD",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error('Joel AI error:', err.message);
    }
};

export default chatbotCommand;
