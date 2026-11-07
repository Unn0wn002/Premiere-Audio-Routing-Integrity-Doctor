// Analysis of native rendered PCM only; never edits Premiere or its projects.
const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const dir = __dirname;
function analyze(name) {
  const b = fs.readFileSync(`${dir}/${name}`);
  assert.equal(b.toString('ascii', 0, 4), 'RIFF');
  assert.equal(b.toString('ascii', 8, 12), 'WAVE');
  let fmt, data;
  for (let p = 12; p + 8 <= b.length;) {
    const id = b.toString('ascii', p, p + 4), n = b.readUInt32LE(p + 4);
    assert(p + 8 + n <= b.length);
    if (id === 'fmt ') fmt = b.subarray(p + 8, p + 8 + n);
    if (id === 'data') data = b.subarray(p + 8, p + 8 + n);
    p += 8 + n + n % 2;
  }
  assert(fmt && data);
  assert.equal(fmt.readUInt16LE(0), 1);
  assert.equal(fmt.readUInt16LE(2), 2);
  assert.equal(fmt.readUInt16LE(14), 16);
  const rate = fmt.readUInt32LE(4), frames = data.length / 4;
  const output = {name, sha256: crypto.createHash('sha256').update(b).digest('hex'), rate, frames, durationSeconds: frames / rate, channels: []};
  for (let c = 0; c < 2; c++) {
    let peak = 0, sum = 0, nonzero = 0, clipped = 0;
    for (let i = 0; i < frames; i++) {
      const v = data.readInt16LE(i * 4 + c * 2);
      peak = Math.max(peak, Math.abs(v)); sum += v * v;
      nonzero += v !== 0; clipped += v === 32767 || v === -32768;
    }
    const tones = {};
    // One-second interior windows avoid edit boundaries and permit exact integer-frequency projection.
    for (const startSeconds of [0.5, 3.5]) {
      const start = Math.round(startSeconds * rate), n = rate;
      assert(start + n <= frames);
      const window = {};
      for (const hz of [440, 880]) {
        let re = 0, im = 0;
        for (let i = 0; i < n; i++) {
          const v = data.readInt16LE((start + i) * 4 + c * 2) / 32768;
          const phase = 2 * Math.PI * hz * i / rate;
          re += v * Math.cos(phase); im += v * Math.sin(phase);
        }
        const amplitude = 2 * Math.hypot(re, im) / n;
        window[hz] = {amplitude, dBFS: amplitude ? 20 * Math.log10(amplitude) : '-Infinity'};
      }
      tones[startSeconds] = window;
    }
    output.channels.push({channel: c ? 'Right' : 'Left', peakInteger: peak, rmsDBFS: sum ? 20 * Math.log10(Math.sqrt(sum / frames) / 32768) : '-Infinity', nonzeroSamples: nonzero, clippedSamples: clipped, tones});
  }
  return output;
}
const baseline = analyze('active-sequence-baseline.wav');
const positive = analyze(process.argv[2] || 'positive-signal.wav');
const checks = {
  sameDurationAndRate: baseline.frames === positive.frames && baseline.rate === positive.rate,
  baselineSilent: baseline.channels.every(c => c.nonzeroSamples === 0),
  positiveBothChannelsPresent: positive.channels.every(c => c.nonzeroSamples > 0 && c.clippedSamples === 0),
  separatedTonesBothWindows: [0.5, 3.5].every(t => {
    const l = positive.channels[0].tones[t], r = positive.channels[1].tones[t];
    return l[440].amplitude > 0.01 && r[880].amplitude > 0.01 && l[440].amplitude > 100 * l[880].amplitude && r[880].amplitude > 100 * r[440].amplitude;
  })
};
const result = {method: 'Native WAV exhaustive PCM statistics plus 440/880 Hz projections in two interior windows', baseline, positive, checks, result: Object.values(checks).every(Boolean) ? 'PASS_BOUNDED_RENDERED_CHANNEL_CONTROL' : 'REVIEW', limits: 'One active sequence and fixed render settings. No physical device or general routing certification.'};
fs.writeFileSync(`${dir}/${process.argv[3] || 'positive-signal-analysis.json'}`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
