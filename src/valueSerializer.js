// Only inspect the documented value fields; never enumerate arbitrary host objects.
const FIELDS = ['value', 'ticks', 'seconds', 'ticksPerFrame', 'numerator', 'denominator', 'position', 'x', 'y', 'red', 'green', 'blue', 'alpha'];
function plainValue(value, depth = 0, ancestors = new Set(), budget = { left: 2048 }) {
  if (--budget.left < 0 || depth > 8) throw new Error('Serialization bound exceeded');
  if (value === undefined) return { $type: 'undefined' };
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return { $type: 'bigint', value: value.toString() };
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value, -0)) return { $type: 'number', value: Object.is(value, -0) ? '-0' : String(value) };
    if (Number.isInteger(value) && !Number.isSafeInteger(value)) throw new Error('Unsafe integer; exact precision unavailable');
    return value;
  }
  if (typeof value !== 'object') throw new Error('Unsupported value type: ' + typeof value);
  if (ancestors.has(value)) throw new Error('Cyclic value');
  ancestors.add(value);
  try {
    if (Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView))) {
      if (value.length > 1024) throw new Error('Array bound exceeded');
      return Array.from(value, v => plainValue(v, depth + 1, ancestors, budget));
    }
    const out = {};
    for (const key of FIELDS) {
      if (key in value) out[key] = plainValue(value[key], depth + 1, ancestors, budget);
    }
    if (!Object.keys(out).length) throw new Error('Unsupported object shape');
    // Plain data objects may not silently lose unexpected fields.
    if (Object.getPrototypeOf(value) === Object.prototype && Object.keys(value).some(k => !FIELDS.includes(k))) throw new Error('Unsupported object fields');
    return out;
  } finally { ancestors.delete(value); }
}
module.exports = { plainValue };
