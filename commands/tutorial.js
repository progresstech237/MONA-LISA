const settings = require("../settings");
const os = require("os");
const path = require("path");
const fs = require("fs");

// Uptime formatter
function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

async function tutorialCommand(sock, chatId, message) {
    try {
        // ❤️ Reaction when command triggered
        await sock.sendMessage(chatId, {
            react: {
                text: "📸",
                key: message.key
            }
        });

        const userName = message.pushName || "User";
        const botUptime = runtime(process.uptime());
        const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemory = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
        const host = os.platform();

        const brand = require('../lib/brand');
        const uptimeMessage =
            `👋 \`Hello ${userName}, here are the tutorials\` 

` +
            `*${brand.BOT_NAME} is easy to deploy.*

` +
            `*YouTube:* ${brand.MY_YOUTUBE_LINK}
` +
            `*Channel:* ${brand.MY_CHANNEL_LINK}
` +
            `*Support:* ${brand.CONTACT_LINK}

` +
            `> ${brand.POWERED_BY}`;

        // Resolve the local image path
        const imagePath = path.resolve(__dirname, "../assets/IMG-20250819-WA0001(1).jpg");

        // Send local image
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(imagePath),
            caption: uptimeMessage
        }, { quoted: message });

    } catch (error) {
        console.error("Error in alive command:", error);

        // Send fallback text
        await sock.sendMessage(chatId, {
            text: `❌ An error occurred, but here's the info:\n\n${uptimeMessage}`
        }, { quoted: message });

        await sock.sendMessage(chatId, {
            react: { text: "⚠️", key: message.key }
        });
    }
}

module.exports = tutorialCommand;
