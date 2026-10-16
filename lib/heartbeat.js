'use strict';
/**
 * Signed liveness/readiness heartbeat to the MONA LISA MD control plane.
 * Enabled only when MONA_HEARTBEAT_URL, MONA_DEPLOYMENT_ID and MONA_HEARTBEAT_SECRET are all set.
 * The payload carries NO credentials. It distinguishes "process alive" from "WhatsApp actually connected".
 */
const crypto = require('crypto');

function signBody(secret, deploymentId, ts, body) {
  return crypto.createHmac('sha256', secret).update(`${deploymentId}.${ts}.${body}`).digest('hex');
}

function startHeartbeat({ env = process.env, getState, intervalMs = 30000, fetchImpl = globalThis.fetch, log = () => {} } = {}) {
  const url = env.MONA_HEARTBEAT_URL, id = env.MONA_DEPLOYMENT_ID, secret = env.MONA_HEARTBEAT_SECRET;
  if (!url || !id || !secret || typeof fetchImpl !== 'function') return { stop() {} };
  const startedAt = Date.now();
  async function beat() {
    const ts = Date.now();
    const s = (getState && getState()) || {};
    const body = JSON.stringify({
      deploymentId: id, ts, processRunning: true, baileysConnected: !!s.baileysConnected,
      uptimeSec: Math.round((ts - startedAt) / 1000), rssMb: Math.round(process.memoryUsage().rss / 1048576),
      version: env.MONA_VERSION || 'dev',
    });
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
      await fetchImpl(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-mona-ts': String(ts), 'x-mona-signature': signBody(secret, id, ts, body) }, body, signal: ctl.signal });
      clearTimeout(t);
    } catch (e) { log(`[heartbeat] failed: ${e.name}`); }
  }
  beat();
  const h = setInterval(beat, intervalMs); if (h.unref) h.unref();
  return { stop() { clearInterval(h); }, beat };
}

module.exports = { startHeartbeat, signBody };
