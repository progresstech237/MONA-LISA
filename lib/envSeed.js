'use strict';
/**
 * Applies deployment configuration (from the MONA LISA MD dashboard) to the bot's REAL runtime settings.
 * The bot stores its global toggles in data/*.json (changed at runtime by commands), not in env vars, so the
 * dashboard passes MONA_FEATURES (JSON) + PREFIX and this module writes those files before the bot starts.
 *
 * Only features that genuinely exist as global toggles in this bot are supported. Per-group features
 * (antilink, antibadword, welcome/goodbye) and DB-backed ones (anticall) are intentionally NOT seeded.
 */
const fs = require('fs');
const path = require('path');

const SUPPORTED = Object.freeze(['autoRead', 'autoTyping', 'autoRecording', 'alwaysOnline', 'antiDelete', 'autoStatusLike']);

function mergeJson(file, patch) {
  let cur = {};
  try { const raw = fs.readFileSync(file, 'utf8'); if (raw.trim()) cur = JSON.parse(raw); } catch (_) { cur = {}; }
  if (!cur || typeof cur !== 'object' || Array.isArray(cur)) cur = {};
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ ...cur, ...patch }, null, 2));
}

/** @returns {string[]} list of settings that were applied */
function applyFeatures(dataDir, features = {}, prefix) {
  const applied = [];
  const f = (k) => (typeof features[k] === 'boolean' ? features[k] : undefined);
  const set = (name, file, patch) => { mergeJson(path.join(dataDir, file), patch); applied.push(name); };

  if (typeof prefix === 'string' && /^[^\s\w]{1,3}$/.test(prefix)) set('prefix', 'prefix.json', { prefix });
  if (f('autoTyping') !== undefined) set('autoTyping', 'autotyping.json', { enabled: f('autoTyping') });
  if (f('autoRecording') !== undefined) set('autoRecording', 'autorecording.json', { enabled: f('autoRecording') });
  if (f('alwaysOnline') !== undefined) set('alwaysOnline', 'alwaysonline.json', { enabled: f('alwaysOnline') });
  if (f('antiDelete') !== undefined) set('antiDelete', 'antidelete.json', { enabled: f('antiDelete') });
  if (f('autoRead') !== undefined) set('autoRead', 'autoread.json', { mode: f('autoRead') ? 'all' : 'off' });
  if (f('autoStatusLike') !== undefined) {
    // Reacting to a status requires viewing it, so enabling "like" enables both.
    set('autoStatusLike', 'autoStatus.json', { enabled: f('autoStatusLike'), reactOn: f('autoStatusLike') });
  }
  return applied;
}

/** Reads MONA_FEATURES / PREFIX from the environment. Invalid JSON is ignored (bot keeps its defaults). */
function seedFromEnv(dataDir = path.join(__dirname, '..', 'data'), env = process.env, log = console.log) {
  if (!env.MONA_FEATURES && !env.MONA_PREFIX) return [];
  let features = {};
  if (env.MONA_FEATURES) {
    try { const j = JSON.parse(env.MONA_FEATURES); if (j && typeof j === 'object') features = j; }
    catch (_) { log('[config] MONA_FEATURES is not valid JSON; ignoring'); }
  }
  const applied = applyFeatures(dataDir, features, env.MONA_PREFIX);
  if (applied.length) log(`[config] applied: ${applied.join(', ')}`);
  return applied;
}

module.exports = { applyFeatures, seedFromEnv, SUPPORTED };
