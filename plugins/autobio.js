const { cmd } = require('../command');
const moment = require('moment');
const config = require('../config');

let autoBioInterval = null;
let isAutoBioEnabled = true; // Enabled by default

// Function to update bio with current time
const updateBio = async (conn) => {
    try {
        const now = moment();
        const time = now.format('HH:mm:ss');
        const day = now.format('dddd');
        const date = now.format('D MMMM YYYY');
        const name = config.OWNER_NAME || 'Marisel';
        
        const newBio = `⏰ ${time} | ${day} | 📅 ${date} | ${name}`;
        
        await conn.updateProfileStatus(newBio);
    } catch (e) {
        console.error('AutoBio Update Error:', e);
    }
};

// Start the auto-bio updates
const startAutoBio = (conn) => {
    if (autoBioInterval) clearInterval(autoBioInterval);
    autoBioInterval = setInterval(() => updateBio(conn), 1000); // Update every second
    updateBio(conn); // Immediate first update
};

cmd({
    pattern: "autobio",
    alias: ["bio"],
    desc: "Toggle automatic bio updates with time/date",
    category: "utility",
    react: "⏳",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const action = m.args[0]?.toLowerCase();
        
        if (action === 'off') {
            if (!isAutoBioEnabled) return reply('❌ Auto-bio is already off');
            clearInterval(autoBioInterval);
            autoBioInterval = null;
            isAutoBioEnabled = false;
            return reply('*Auto-bio updates disabled*');
        } 
        else if (action === 'on') {
            if (isAutoBioEnabled) return reply('❌ Auto-bio is already on');
            isAutoBioEnabled = true;
            startAutoBio(conn);
            return reply('*Auto-bio updates enabled*');
        }
        else {
            // Toggle if no argument provided
            if (isAutoBioEnabled) {
                clearInterval(autoBioInterval);
                autoBioInterval = null;
                isAutoBioEnabled = false;
                return reply('✅ Auto-bio updates disabled');
            } else {
                isAutoBioEnabled = true;
                startAutoBio(conn);
                return reply('✅ Auto-bio updates enabled');
            }
        }
    } catch (e) {
        console.error('AutoBio Command Error:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

// Initialize on bot start
module.exports.init = (conn) => {
    if (isAutoBioEnabled) {
        startAutoBio(conn);
    }
};
