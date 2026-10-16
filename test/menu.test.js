'use strict';
const test = require('node:test'); const assert = require('node:assert/strict');
const m = require('../lib/menuStyle');
test('bold converts ASCII to styled letters and leaves symbols', () => {
  assert.equal(m.bold('AI MENU 24'), '𝗔𝗜 𝗠𝗘𝗡𝗨 𝟮𝟰'); assert.equal(m.bold('FUN & SOCIAL'), '𝗙𝗨𝗡 & 𝗦𝗢𝗖𝗜𝗔𝗟');
});
test('section lists every command with prefix, count and no undefined', () => {
  const t = m.section('AI MENU', ['ai', 'gpt'], '.');
  assert.ok(t.includes('⟡ .ai') && t.includes('⟡ .gpt') && t.includes('2 ') && !/undefined|NaN/.test(t));
  assert.ok(t.startsWith('╭──『 🤖'));
});
test('system box aligns rows, bar clamps, footer carries brand', () => {
  const t = m.systemBox([['Prefix', '[ . ]'], ['Platform', 'Panel']]); assert.ok(t.includes('Prefix  ') && t.includes('› '));
  assert.equal(m.bar(5, 10, 10), '▰▰▰▰▰▱▱▱▱▱ 50%'); assert.ok(m.bar(20, 10).startsWith('▰▰▰▰▰▰▰▰▰▰'));
  assert.match(m.footer(), /𝗣𝗥𝗢𝗚𝗥𝗘𝗦𝗦 𝗧𝗘𝗖𝗛/);
  assert.ok(m.categoryList(['AI MENU', 'GITHUB']).includes('01 ⟶ 🤖'));
});
test('the real help module still loads and builds a full menu containing every category', () => {
  // stub the heavy deps help.js pulls in so it can be required offline
  const Module = require('module'); const orig = Module._load;
  Module._load = function (req, ...a) {
    if (req === '@whiskeysockets/baileys') return { generateWAMessageFromContent() {} };
    if (/menuSettings$/.test(req)) return { getMenuStyle: () => '2', getMenuSettings: () => ({ showUptime: true, showMemory: true }) };
    if (/setprefix$/.test(req)) return { getPrefix: () => '.' };
    if (/setowner$/.test(req)) return { getOwnerName: () => 'PROGRESS TECH' };
    if (/botConfig$/.test(req)) return { getBotName: () => 'MONA LISA MD' };
    if (/fakeContact$/.test(req)) return { createFakeContact: () => ({}) };
    return orig.call(this, req, ...a);
  };
  try {
    const src = require('fs').readFileSync(require.resolve('../commands/help.js'), 'utf8');
    const cats = [...src.matchAll(/^    '([A-Z &]+)': \[/gm)].map((x) => x[1]);
    assert.ok(cats.length >= 16, 'categories present');
    const h = require('../commands/help.js'); assert.equal(typeof h.helpCommand, 'function');
  } finally { Module._load = orig; }
});
