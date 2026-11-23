// npm audit as a ratchet (dispatch 23 Nov 2026, item 7): the committed
// baseline (security/npm-audit-baseline.json) is the ignore — nothing fails
// today, anything new fails tomorrow; a finding that went away is reported as
// burned down and the next `baseline` run shrinks the file.
//   npm audit --json > /tmp/npm-audit.json ; true
//   node scripts/npm-audit-ratchet.mjs check    /tmp/npm-audit.json
//   node scripts/npm-audit-ratchet.mjs baseline /tmp/npm-audit.json
// A finding is "<package>|<advisory url or dependency>" from npm's `via` list.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const BASELINE = 'security/npm-audit-baseline.json';
const [, , mode, report] = process.argv;
if (!['check', 'baseline'].includes(mode) || !report) {
  console.error('usage: node scripts/npm-audit-ratchet.mjs <check|baseline> <npm-audit.json>');
  process.exit(2);
}
const audit = JSON.parse(readFileSync(report, 'utf8') || '{}');
const keys = new Set();
for (const [name, v] of Object.entries(audit.vulnerabilities ?? {})) {
  for (const via of v.via ?? []) keys.add(`${name}|${typeof via === 'string' ? via : via.url ?? via.title ?? 'advisory'}`);
}
const current = [...keys].sort();
if (mode === 'baseline') {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
  console.log(`npm audit baseline written: ${current.length} finding(s)`);
  process.exit(0);
}
if (!existsSync(BASELINE)) {
  console.error('npm audit ratchet: no baseline; run `node scripts/npm-audit-ratchet.mjs baseline <report>`');
  process.exit(1);
}
const baseline = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')));
const fresh = current.filter((k) => !baseline.has(k));
const burned = [...baseline].filter((k) => !keys.has(k));
for (const k of fresh) console.log(`npm audit ratchet: NEW ${k}`);
console.log(`npm audit ratchet: ${current.length} now vs ${baseline.size} baseline; ${fresh.length} new; ${burned.length} burned down`);
if (burned.length) console.log('npm audit ratchet: rewrite the baseline to keep the burn-down: node scripts/npm-audit-ratchet.mjs baseline <report>');
process.exit(fresh.length ? 1 : 0);
