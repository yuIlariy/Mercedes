const { cmd, commands } = require('../command');
const config = require('../config');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "mend",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, prefix, reply }) => {
    try {
        // Count total commands
        const totalCommands = commands.length;
        
        const menuCaption = `*╭┈───────────────•*
*│  ◦* ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}
*│  ◦* ʀᴀᴍ ᴜꜱᴀɢᴇ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*│  ◦* ᴍᴏᴅᴇ : *[${config.MODE}]*
*│  ◦* ᴘʀᴇғɪx : *[${config.PREFIX}]*
*│  ◦* ᴄᴍᴅs : *${totalCommands}*
*╰┈───────────────•*

*╭━〈 ✦${config.BOT_NAME}✦ 〉━◆*
*│* ʏᴏᴜ ᴄᴀɴ ᴄʟɪᴄᴋ ᴛʜᴇ ʙᴜᴛᴛᴏɴꜱ ʙᴇʟᴏᴡ ᴛᴏ ᴀᴄᴄᴇꜱꜱ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴍᴇɴᴜꜱ
*╰┈───────────────•*`;

        // Create buttons for all menu categories
        const generatebutton = [
            {
                buttonId: `${prefix}ownermenu`,
                buttonText: { displayText: '👑 ᴏᴡɴᴇʀ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}downmen`,
                buttonText: { displayText: '📥 ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}adminmenu`, 
                buttonText: { displayText: '🛡️ ᴀᴅᴍɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}searchmen`,
                buttonText: { displayText: '🔍 ꜱᴇᴀʀᴄʜ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}convertmen`,
                buttonText: { displayText: '🔄 ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}logomen`,
                buttonText: { displayText: '🎨 ʟᴏɢᴏ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}othermenu`,
                buttonText: { displayText: '📌 ᴏᴛʜᴇʀ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: config.MENU_IMAGE_URL || 'https://telegra.ph/file/24b19e11c51c3b8dde0a1.jpg' },
            caption: menuCaption,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });

    } catch (e) {
        console.error('Menu Error:', e);
        reply('❌ An error occurred while displaying the menu. Please try again.');
    }
});

// Download Menu (updated with buttons)
cmd({
    pattern: "downmen",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*📥 ${config.BOT_NAME} DOWNLOAD COMMANDS MENU 📥*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'download' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/24b19e11c51c3b8dde0a1.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});

// Search Menu (updated with buttons)
cmd({
    pattern: "searchmen",
    react: "🔍",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*🔍 ${config.BOT_NAME} SEARCH COMMANDS MENU 🔍*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'search' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/0daa736951473c130e73f.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});

// Convert Menu (updated with buttons)
cmd({
    pattern: "convertmen",
    react: "🔄",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*🔄 ${config.BOT_NAME} CONVERT COMMANDS MENU 🔄*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'convert' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/0daa736951473c130e73f.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});

// Logo Menu (updated with buttons)
cmd({
    pattern: "logomen",
    react: "🎨",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*🎨 ${config.BOT_NAME} LOGO COMMANDS MENU 🎨*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'logo' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/5e61a90b90c6307a0757e.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});

// Owner Menu (updated with buttons)
cmd({
    pattern: "ownermenu",
    react: "👑",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*👑 ${config.BOT_NAME} OWNER COMMANDS MENU 👑*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'owner' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/787b6b23e75057e08e69b.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});

// Admin Menu (updated with buttons)
cmd({
    pattern: "adminmenu",
    react: "🛡️",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*🛡️ ${config.BOT_NAME} ADMIN COMMANDS MENU 🛡️*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'admin' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/7f48f7bbbe85de4532d71.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});

// Other Menu (updated with buttons)
cmd({
    pattern: "othermenu",
    react: "📌",
    dontAddCommandList: true,
    filename: __filename
}, async(conn, mek, m, {from, prefix, reply}) => {
    try {
        let menuc = `*● ══════════════ ●*\n\n*📌 ${config.BOT_NAME} OTHER COMMANDS MENU 📌*\n\n`;
        
        for (let i=0; i<commands.length; i++) { 
            if(commands[i].category === 'other' && !commands[i].dontAddCommandList) {
                menuc += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        };

        const generatebutton = [
            {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: '🏠 ʙᴀᴄᴋ ᴛᴏ ᴍᴀɪɴ ᴍᴇɴᴜ' },
                type: 1
            },
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: '🚀 ʙᴏᴛ ꜱᴘᴇᴇᴅ' },
                type: 1
            }
        ];

        const buttonMessaged = {
            image: { url: 'https://telegra.ph/file/01994d1adb2fe606c3dd2.jpg' },
            caption: menuc,
            footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME} ◎ ${config.OWNER_NAME}`,
            headerType: 4,
            buttons: generatebutton
        };

        await conn.sendMessage(from, buttonMessaged, { quoted: mek });
    } catch (e) {
        reply('*ERROR !!*');
        console.log(e);
    }
});
