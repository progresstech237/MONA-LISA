'use strict';
/**
 * MONA LISA MD — "Royal Glass" menu style.
 * Pure text helpers (no WhatsApp/Baileys dependency) so the look can be unit-tested.
 */
const brand = require('./brand');

// A–Z / a–z / 0–9 -> Mathematical Sans-Serif Bold (renders as bold in WhatsApp on every platform)
function bold(text) {
  let out = '';
  for (const ch of String(text)) {
    const c = ch.codePointAt(0);
    if (c >= 65 && c <= 90) out += String.fromCodePoint(0x1d5d4 + (c - 65));
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(0x1d5ee + (c - 97));
    else if (c >= 48 && c <= 57) out += String.fromCodePoint(0x1d7ec + (c - 48));
    else out += ch;
  }
  return out;
}

const ICONS = {
  'OWNER MENU': '👑', 'AI MENU': '🤖', 'GROUP ADMIN': '🛡️', 'GROUP TOOLS': '👥', 'DOWNLOADER': '📥', 'SEARCHING TOOLS': '🔎',
  'STICKER MENU': '🎴', 'CONVERTER': '🔁', 'GAME MENU': '🎮', 'FUN & SOCIAL': '🎉', 'ANIME MENU': '🌸', 'TEXT MAKER': '🖋️',
  'IMG EDIT': '🖼️', 'STATUS MENU': '📡', 'SPORTS MENU': '⚽', 'GITHUB': '💻',
};
const iconFor = (cat) => ICONS[cat] || '✦';

const bar = (used, total, size = 10) => {
  const f = Math.max(0, Math.min(size, Math.round((used / total) * size)));
  return `${'▰'.repeat(f)}${'▱'.repeat(size - f)} ${Math.round((used / total) * 100)}%`;
};

function title(name) { return `${iconFor(name)} ${bold(name)}`; }

function banner(botName) {
  return `┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👑 ✦ ${botName} ✦ 👑\n┗━━━━━━━━━━━━━━━━━━━━━━┛`;
}

/** rows: [[label, value], ...] */
function systemBox(rows) {
  const w = Math.max(...rows.map((r) => r[0].length));
  let t = `╭──❖ ${bold('SYSTEM')} ❖──╮\n`;
  for (const [k, v] of rows) t += `│ ◈ ${k.padEnd(w, ' ')}  ›  ${v}\n`;
  return t + '╰───────────────────╯';
}

function section(category, cmds, prefix, { withCount = true } = {}) {
  let t = `╭──『 ${title(category)} 』\n`;
  if (withCount) t += `│ ✦ ${cmds.length} ${bold('commands')}\n├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
  for (const c of cmds) t += `│ ⟡ ${prefix}${c}\n`;
  return t + '╰──────────────────✦';
}

function categoryList(categories) {
  let t = `╭──『 ✦ ${bold('CATEGORIES')} ✦ 』\n`;
  categories.forEach((c, i) => { t += `│ ${String(i + 1).padStart(2, '0')} ⟶ ${iconFor(c)} ${bold(c)}\n`; });
  return t + '╰──────────────────✦';
}

const footer = () => `✦ ${bold('POWERED BY')} ${bold(brand.OWNER_NAME)} ✦`;

module.exports = { bold, iconFor, bar, title, banner, systemBox, section, categoryList, footer };
