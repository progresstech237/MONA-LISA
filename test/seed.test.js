'use strict';
const test = require('node:test'); const assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path');
const { applyFeatures, seedFromEnv } = require('../lib/envSeed');
const { startHeartbeat, signBody } = require('../lib/heartbeat');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'seed-'));
const rd = (d, f) => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));

test('applyFeatures writes the bot\'s real files and preserves other fields', () => {
  const d = tmp();
  fs.writeFileSync(path.join(d, 'antidelete.json'), JSON.stringify({ enabled: false, mode: 'both', maxStorageMB: 200 }));
  fs.writeFileSync(path.join(d, 'anticall.json'), '');           // empty/corrupt file must not crash
  const applied = applyFeatures(d, { autoTyping: true, antiDelete: true, autoRead: true, autoStatusLike: true, alwaysOnline: false, autoRecording: false }, '!');
  assert.deepEqual(rd(d, 'antidelete.json'), { enabled: true, mode: 'both', maxStorageMB: 200 });
  assert.deepEqual(rd(d, 'autotyping.json'), { enabled: true });
  assert.deepEqual(rd(d, 'autoread.json'), { mode: 'all' });
  assert.deepEqual(rd(d, 'autoStatus.json'), { enabled: true, reactOn: true });
  assert.deepEqual(rd(d, 'alwaysonline.json'), { enabled: false });
  assert.deepEqual(rd(d, 'prefix.json'), { prefix: '!' });
  assert.equal(applied.length, 7);
});

test('applyFeatures ignores unknown keys, non-booleans and unsafe prefixes', () => {
  const d = tmp();
  const applied = applyFeatures(d, { antiLink: true, hacked: true, autoTyping: 'yes' }, 'ab');
  assert.deepEqual(applied, []);
  assert.deepEqual(fs.readdirSync(d), []);
});

test('seedFromEnv tolerates invalid JSON', () => {
  const d = tmp(); const logs = [];
  assert.deepEqual(seedFromEnv(d, { MONA_FEATURES: '{not json' }, (m) => logs.push(m)), []);
  assert.ok(logs[0].includes('not valid JSON'));
  assert.deepEqual(seedFromEnv(d, { MONA_FEATURES: '{"autoTyping":true}' }, () => {}), ['autoTyping']);
});

test('heartbeat is signed, credential-free, and disabled without config', async () => {
  assert.equal(typeof startHeartbeat({ env: {} }).stop, 'function');
  let sent = null;
  const env = { MONA_HEARTBEAT_URL: 'https://cp.example/api/worker/heartbeat', MONA_DEPLOYMENT_ID: 'dep1', MONA_HEARTBEAT_SECRET: 'sek' };
  const hb = startHeartbeat({ env, getState: () => ({ baileysConnected: true }), fetchImpl: async (u, o) => { sent = { u, o }; return {}; } });
  await new Promise((r) => setTimeout(r, 20)); hb.stop();
  assert.equal(sent.u, env.MONA_HEARTBEAT_URL);
  const ts = sent.o.headers['x-mona-ts'];
  assert.equal(sent.o.headers['x-mona-signature'], signBody('sek', 'dep1', ts, sent.o.body));
  const b = JSON.parse(sent.o.body);
  assert.equal(b.baileysConnected, true);
  assert.ok(!/SESSION|creds|MONA-LISA:~/.test(sent.o.body));
});
