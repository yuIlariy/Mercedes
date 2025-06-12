const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')

cmd({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Show all available commands with descriptions",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Count total commands and aliases
        const totalCommands = Object.keys(commands).length
        let aliasCount = 0
        Object.values(commands).forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length
        })

        // Get unique categories count
        const categories = [...new Set(Object.values(commands).map(c => c.category)]

        let menuText = `*╭┈───────────────•*
*〈 ${config.BOT_NAME} Command List 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 🤖 *Bot Name:* ${config.BOT_NAME}
*│  ◦* 👑 *Owner:* ${config.OWNER_NAME}
*│  ◦* ⚙️ *Prefix:* [${config.PREFIX}]
*│  ◦* 🌐 *Platform:* Heroku
*│  ◦* 📦 *Version:* 4.0.0
*│  ◦* 🕒 *Runtime:* ${runtime(process.uptime())}
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 📜 *Total Commands:* ${totalCommands}
*│  ◦* 🔄 *Total Aliases:* ${aliasCount}
*│  ◦* 🗂️ *Categories:* ${categories.length}
*╰┈───────────────•*\n`

        // Organize commands by category
        const categorized = {}
        categories.forEach(cat => {
            categorized[cat] = Object.values(commands).filter(c => c.category === cat)
        })

        // Generate menu for each category
        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `*╭┈── ${category.toUpperCase()} ──•*
*│  ◦* 📂 *Commands:* ${cmds.length}
*│  ◦* 🔄 *Aliases:* ${cmds.reduce((a, c) => a + (c.alias ? c.alias.length : 0), 0)}
*╰┈───────────────•*\n`

            cmds.forEach(c => {
                menuText += `*┋* 📄 *Command:* .${c.pattern}\n`
                menuText += `*┋* ❕ ${c.desc || 'No description'}\n`
                if (c.alias?.length) {
                    menuText += `*┋* 🔹 *Aliases:* ${c.alias.map(a => `.${a}`).join(', ')}\n`
                }
                if (c.use) {
                    menuText += `*┋* 💡 *Usage:* ${c.use}\n`
                }
                menuText += `*╰┈───────────────•*\n`
            })
        }

        menuText += `*◆─〈 ✦${config.BOT_NAME}✦ 〉─◆*
*╭┈───────────────•*
*│* 📝 *Note:* Use ${config.PREFIX}help <command> for details
*│* ${config.DESCRIPTION}
*╰┈───────────────•*`

        await conn.sendMessage(from, { 
            video: { url: 'https://files.catbox.moe/6zh63g.mp4' },
            caption: menuText,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: config.OWNER_NAME || config.BOT_NAME,
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `${config.BOT_NAME} Commands`,
                    body: `${totalCommands} Commands | ${categories.length} Categories`,
                    mediaType: 2,
                    thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tpzqtm.jpg',
                    sourceUrl: config.SUPPORT_LINK,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek })

    } catch (e) {
        console.error('Command List Error:', e)
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Command List Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek })
    }
})
