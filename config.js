const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // Core Settings
    SESSION_ID: process.env.SESSION_ID || "",
    PREFIX: process.env.PREFIX || ".",
    MODE: process.env.MODE || "public",
    DEV: process.env.DEV || "254740007567",
    
    // Bot Identity
    BOT_NAME: process.env.BOT_NAME || "Mercedes",
    OWNER_NAME: process.env.OWNER_NAME || "Marisel",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254740007567",
    DESCRIPTION: process.env.DESCRIPTION || "*Made By Marisel*",
    STICKER_NAME: process.env.STICKER_NAME || "Marisel",
    
    // Media URLs
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/7zfdcq.jpg",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/avqa3c.jpg",
    
    // Status Features
    AUTO_STATUS_SEEN: convertToBool(process.env.AUTO_STATUS_SEEN || "true"),
    AUTO_STATUS_REACT: convertToBool(process.env.AUTO_STATUS_REACT || "true"),
    AUTO_STATUS_REPLY: convertToBool(process.env.AUTO_STATUS_REPLY || "false"),
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*seen*",
    
    // Group Features
    WELCOME: convertToBool(process.env.WELCOME || "true"),
    ADMIN_EVENTS: convertToBool(process.env.ADMIN_EVENTS || "false"),
    ANTI_LINK: convertToBool(process.env.ANTI_LINK || "true"),
    ANTI_LINK_KICK: convertToBool(process.env.ANTI_LINK_KICK || "false"),
    DELETE_LINKS: convertToBool(process.env.DELETE_LINKS || "false"),
    
    // Message Handling
    ANTI_DELETE: convertToBool(process.env.ANTI_DELETE || "true"),
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same",
    READ_MESSAGE: convertToBool(process.env.READ_MESSAGE || "false"),
    READ_CMD: convertToBool(process.env.READ_CMD || "false"),
    MENTION_REPLY: convertToBool(process.env.MENTION_REPLY || "false"),
    
    // Automation
    AUTO_REACT: convertToBool(process.env.AUTO_REACT || "false"),
    CUSTOM_REACT: convertToBool(process.env.CUSTOM_REACT || "false"),
    CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    AUTO_STICKER: convertToBool(process.env.AUTO_STICKER || "false"),
    AUTO_REPLY: convertToBool(process.env.AUTO_REPLY || "false"),
    AUTO_TYPING: convertToBool(process.env.AUTO_TYPING || "false"),
    AUTO_RECORDING: convertToBool(process.env.AUTO_RECORDING || "false"),
    
    // Presence
    ALWAYS_ONLINE: convertToBool(process.env.ALWAYS_ONLINE || "false"),
    PUBLIC_MODE: convertToBool(process.env.PUBLIC_MODE || "true"),
    
    // Content Moderation
    ANTI_BAD: convertToBool(process.env.ANTI_BAD || "false"),
    ANTI_VV: convertToBool(process.env.ANTI_VV || "true"),
    
    // Chatbot
    CHAT_BOT: convertToBool(process.env.CHAT_BOT || false),
    CHAT_BOT_MODE: process.env.CHAT_BOT_MODE || "public",
    
    // Messages
    LIVE_MSG: process.env.LIVE_MSG || "> *Marisel Made It*"
};
