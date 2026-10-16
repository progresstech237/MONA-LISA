const brand = require('./brand');

const channelInfo = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: false,
    forwardedNewsletterMessageInfo: {
      newsletterJid: brand.MY_CHANNEL_JID,
      newsletterName: brand.PACKNAME,
      serverMessageId: -1,
    }
  }
};

module.exports = {
  channelInfo
};
