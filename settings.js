const brand = require('./lib/brand');

const settings = {
  packname: brand.PACKNAME,
  author: brand.AUTHOR_NAME,
  botName: brand.BOT_NAME,
  botOwner: brand.OWNER_NAME,
  ownerNumber: brand.OWNER_NUMBER, // digits only, country code included, no '+'
  giphyApiKey: process.env.GIPHY_API_KEY || '',
  commandMode: process.env.MODE || "public",
  maxStoreMessages: 20,
  storeWriteInterval: 10000,
  description: "MONA LISA MD — WhatsApp multi-device bot by PROGRESS TECH.",
  version: "2.0.0",
  updateBranch: 'main',
  updateZipToken: '',
  updateZipUrl: brand.REPO_URL,
  timezone: process.env.TZ || 'Africa/Douala',
};

module.exports = settings;
