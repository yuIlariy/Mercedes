const { cmd } = require('../command');
const config = require('../config');
let autoBioEnabled = true; // Default enabled

function updateBio(conn) {
    if (!autoBioEnabled) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const date = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const bioText = `⏰ ${time} | ${day} | 📅 ${date} | ${config.BOT_NAME}`;
    
    conn.updateProfileStatus(bioText).catch(console.error);
}

cmd({
    pattern: "autobio",
    alias: ["bio"],
    desc: "Toggle automatic bio updates",
    category: "system",
    react: "🔄",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, isCreator }) => {
    if (!isCreator) return reply("❌ Owner only command!");

    const action = args[0]?.toLowerCase();
    
    if (action === "on") {
        autoBioEnabled = true;
        updateBio(conn);
        reply("✅ Auto-bio enabled!");
    } else if (action === "off") {
        autoBioEnabled = false;
        reply("❌ Auto-bio disabled!");
    } else {
        reply(`Current status: ${autoBioEnabled ? "✅ ON" : "❌ OFF"}\nUsage: ${config.PREFIX}autobio on/off`);
    }
});

// Update bio every second
setInterval(() => {
    if (autoBioEnabled && conn) {
        updateBio(conn);
    }
}, 1000);

// Initial update
module.exports = {
    init: (conn) => {
        if (autoBioEnabled) {
            updateBio(conn);
        }
    }
};
