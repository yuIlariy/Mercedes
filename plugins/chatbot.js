const { cmd } = require('../command');
const moment = require('moment');
const config = require('../config');

let autoBioEnabled = true; // Enabled by default
let updateInterval = 60000; // Update every 1 minute (in milliseconds)

// Function to update profile bio
const updateBio = async (conn) => {
    try {
        const now = moment();
        const time = now.format('HH:mm:ss');
        const day = now.format('dddd');
        const date = now.format('D MMMM YYYY');
        const name = config.OWNER_NAME || 'Marisel';
        
        const newBio = `⏰ ${time} | ${day} | 📅 ${date} | ${name}`;
        
        await conn.updateProfileStatus(newBio);
        console.log(`[AutoBio] Profile updated at ${time}`);
    } catch (e) {
        console.error('[AutoBio Error]', e);
    }
};

cmd({
    pattern: "autobio",
    alias: ["bio"],
    desc: "Toggle automatic bio updates with time/date",
    category: "utility",
    react: "⏳",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const action = m.args[0]?.toLowerCase();
        
        if (action === 'off') {
            if (!autoBioEnabled) return reply('❌ Auto-bio is already off');
            autoBioEnabled = false;
            clearInterval(conn.autoBioInterval);
            return reply('✅ Auto-bio updates disabled');
        } 
        else if (action === 'on') {
            if (autoBioEnabled) return reply('❌ Auto-bio is already on');
            autoBioEnabled = true;
            startAutoBio(conn);
            return reply('✅ Auto-bio updates enabled');
        }
        else if (action === 'status') {
            return reply(`🔄 Auto-bio is currently ${autoBioEnabled ? 'ENABLED' : 'DISABLED'}\n` +
                       `⏱ Update interval: ${updateInterval/1000} seconds\n` +
                       `📝 Current format:\n` +
                       `⏰ HH:mm:ss | Day | 📅 D MMMM YYYY`);
        }
        else {
            return reply(`⚙️ *AutoBio Commands:*\n\n` +
                        `${config.PREFIX}autobio on - Enable updates\n` +
                        `${config.PREFIX}autobio off - Disable updates\n` +
                        `${config.PREFIX}autobio status - Show current settings`);
        }
    } catch (e) {
        console.error('AutoBio Command Error:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

// Start the auto-bio updates
const startAutoBio = (conn) => {
    if (conn.autoBioInterval) clearInterval(conn.autoBioInterval);
    conn.autoBioInterval = setInterval(() => updateBio(conn), updateInterval);
    updateBio(conn); // Immediate first update
};

// Initialize on bot start
module.exports.init = (conn) => {
    if (autoBioEnabled) {
        startAutoBio(conn);
    }
    
    // Also update on reconnection
    conn.ev.on('connection.update', (update) => {
        if (update.connection === 'open' && autoBioEnabled) {
            startAutoBio(conn);
        }
    });
};
