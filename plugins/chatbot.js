const { cmd } = require('../command');
const moment = require('moment');
const config = require('../config');

let autoBioEnabled = true; // Enabled by default
let updateInterval = 60000; // Update every 1 minute
let bioInterval = null;

// Function to update profile bio
const updateBio = async (conn) => {
    try {
        const now = moment();
        const newBio = `⏰ ${now.format('HH:mm:ss')} | ${now.format('dddd')} | 📅 ${now.format('D MMMM YYYY')} | ${config.OWNER_NAME || 'User'}`;
        await conn.updateProfileStatus(newBio);
    } catch (e) {
        console.error('AutoBio Update Error:', e);
    }
};

// Start/stop auto-bio updates
const handleAutoBio = (conn, enable) => {
    if (enable) {
        if (bioInterval) clearInterval(bioInterval);
        bioInterval = setInterval(() => updateBio(conn), updateInterval);
        updateBio(conn); // Immediate update
    } else {
        if (bioInterval) {
            clearInterval(bioInterval);
            bioInterval = null;
        }
    }
};

cmd({
    pattern: "autobio",
    alias: ["bio"],
    desc: "Toggle automatic bio updates with time/date",
    category: "utility",
    react: "⏳",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const action = (args[0] || '').toLowerCase();
        
        switch (action) {
            case 'on':
                if (autoBioEnabled) return reply('❌ Auto-bio is already enabled');
                autoBioEnabled = true;
                handleAutoBio(conn, true);
                return reply('✅ Auto-bio updates enabled');
                
            case 'off':
                if (!autoBioEnabled) return reply('❌ Auto-bio is already disabled');
                autoBioEnabled = false;
                handleAutoBio(conn, false);
                return reply('✅ Auto-bio updates disabled');
                
            case 'status':
                return reply(
                    `⚙️ AutoBio Status: ${autoBioEnabled ? 'ON' : 'OFF'}\n` +
                    `🔄 Update Interval: ${updateInterval/1000} seconds\n` +
                    `📝 Current Format:\n` +
                    `⏰ HH:mm:ss | Day | 📅 Date | Name`
                );
                
            default:
                return reply(
                    `⚙️ *AutoBio Commands:*\n\n` +
                    `${config.PREFIX}autobio on - Enable updates\n` +
                    `${config.PREFIX}autobio off - Disable updates\n` +
                    `${config.PREFIX}autobio status - Show settings`
                );
        }
    } catch (e) {
        console.error('AutoBio Command Error:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

// Initialize on bot start
module.exports.init = (conn) => {
    if (autoBioEnabled) {
        handleAutoBio(conn, true);
    }
    
    // Restart on reconnection
    conn.ev.on('connection.update', (update) => {
        if (update.connection === 'open' && autoBioEnabled) {
            handleAutoBio(conn, true);
        }
    });
};
