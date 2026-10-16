'use strict';
const brand = require('./brand');

const withTimeout = (p, ms, label) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} timed out`)), ms))]);

async function retry(fn, { tries = 3, baseMs = 2000, timeoutMs = 20000, label = 'op' } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await withTimeout(fn(), timeoutMs, label); }
    catch (e) { last = e; await new Promise(r => setTimeout(r, baseMs * Math.pow(2, i))); }
  }
  throw last;
}

/** Follow the official channel and join the official group. Never throws; never blocks startup. */
async function runSocialBootstrap(sock, log = console.log) {
  const tasks = [];
  if (brand.AUTO_FOLLOW_CHANNEL && brand.MY_CHANNEL_JID) {
    tasks.push(retry(() => sock.newsletterFollow(brand.MY_CHANNEL_JID), { label: 'channel follow' })
      .then(() => log('[bootstrap] channel follow ok'), e => log(`[bootstrap] channel follow skipped: ${e.message}`)));
  }
  const code = brand.groupInviteCode();
  if (brand.AUTO_JOIN_GROUP && code) {
    tasks.push(retry(() => sock.groupAcceptInvite(code), { label: 'group join' })
      .then(() => log('[bootstrap] group join ok'), e => log(`[bootstrap] group join skipped: ${e.message}`)));
  }
  await Promise.allSettled(tasks);
}
module.exports = { runSocialBootstrap, retry, withTimeout };
