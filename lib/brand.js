'use strict';
/**
 * MONA LISA MD — single source of truth for identity and links.
 * Everything else in the bot should read from here (or from ./config.js which re-exports it).
 * Values can be overridden with environment variables; defaults are the official ones.
 */
const env = (k, d) => (process.env[k] !== undefined && process.env[k] !== '' ? process.env[k] : d);
const bool = (v) => String(v).toLowerCase() === 'true';

const brand = {
  BOT_NAME: env('BOT_NAME', '👑✦𝐌𝐎𝐍𝐀 𝐋𝐈𝐒𝐀 🤭✦👑'),
  BOT_SHORT_NAME: env('BOT_SHORT_NAME', 'MONA LISA MD'),
  PACKNAME: env('PACKNAME', '👑 ✦ MONA LISA MD 🤭 ✦ 👑'),
  OWNER_NAME: env('OWNER_NAME', 'PROGRESS TECH'),
  AUTHOR_NAME: env('AUTHOR_NAME', 'PROGRESS TECH'),
  OWNER_NUMBER: env('OWNER_NUMBER', '237698830792'),
  FOOTER: env('FOOTER', '> *POWERED BY PROGRESS TECH*'),
  POWERED_BY: 'Powered by PROGRESS TECH',

  MY_CHANNEL_JID: env('MY_CHANNEL_JID', '120363431455356251@newsletter'),
  MY_CHANNEL_LINK: env('MY_CHANNEL_LINK', 'https://whatsapp.com/channel/0029Vb8rLzOCRs1j79bllH05'),
  MY_GROUP_LINK: env('MY_GROUP_LINK', 'https://chat.whatsapp.com/K1Fa4abSnWO5uVkcwApbaC'),
  MY_YOUTUBE_LINK: env('MY_YOUTUBE_LINK', 'https://youtube.com/@progresstech12'),
  CONTACT_LINK: env('CONTACT_LINK', 'https://wa.me/237698830792'),
  REPO_URL: env('REPO_URL', 'https://github.com/progresstech237/MONA-LISA'),

  SESSION_PREFIX: env('SESSION_PREFIX', 'MONA-LISA:~'),
  // Legacy prefix is accepted ONLY when explicitly enabled.
  ALLOW_LEGACY_SESSION_PREFIX: bool(env('ALLOW_LEGACY_SESSION_PREFIX', 'false')),
  LEGACY_SESSION_PREFIX: 'MONA-X:~',

  // Optional social bootstrap on connect. Non-fatal, timeout-protected, can be turned off per deployment.
  AUTO_FOLLOW_CHANNEL: bool(env('AUTO_FOLLOW_CHANNEL', 'true')),
  AUTO_JOIN_GROUP: bool(env('AUTO_JOIN_GROUP', 'true')),

  PAIR_SERVICE_URL: env('PAIR_SERVICE_URL', ''),
};

brand.groupInviteCode = () => {
  const m = /chat\.whatsapp\.com\/([A-Za-z0-9]+)/.exec(brand.MY_GROUP_LINK || '');
  return m ? m[1] : null;
};
brand.sessionPrefixes = () =>
  brand.ALLOW_LEGACY_SESSION_PREFIX ? [brand.SESSION_PREFIX, brand.LEGACY_SESSION_PREFIX] : [brand.SESSION_PREFIX];

module.exports = Object.freeze(brand);
