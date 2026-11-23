// OpenAPI type generation (dispatch 23 Nov 2026, item 6): the backend's
// openapi.json becomes src/types/generated/api.ts, and openapi.pin records
// which document the types came from (its sha256 and, when known, the
// backend commit). `npm run types:api -- <path-or-url> [commit]` regenerates;
// `npm run types:api:check -- <path-or-url>` regenerates to a temp file and
// fails when the committed types or the pin drift from the document. CI runs
// the check against the backend's main when it has a read token for the
// repo; without the token the step says so and passes.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import openapiTS, { astToString } from 'openapi-typescript';

const OUT = 'src/types/generated/api.ts';
const PIN = 'openapi.pin';
const [, , mode, source, commit] = process.argv;
if (!mode || !source) {
  console.error('usage: node scripts/api-types.mjs <generate|check> <openapi.json path or URL> [backend commit]');
  process.exit(2);
}
const document = source.startsWith('http') ? await (await fetch(source, { headers: process.env.OPENAPI_TOKEN ? { Authorization: `Bearer ${process.env.OPENAPI_TOKEN}`, Accept: 'application/vnd.github.raw+json' } : { Accept: 'application/vnd.github.raw+json' } })).text() : readFileSync(source, 'utf8');
const sha = createHash('sha256').update(document).digest('hex');
const ast = await openapiTS(JSON.parse(document), { alphabetize: true });
const header = `// Generated from the backend's openapi.json by scripts/api-types.mjs — do not edit.\n// Document sha256 ${sha}${commit ? ` · backend ${commit}` : ''}.\n`;
const types = header + astToString(ast);
const pin = `${sha}${commit ? ` ${commit}` : ''}\n`;
if (mode === 'generate') {
  writeFileSync(OUT, types);
  writeFileSync(PIN, pin);
  console.log(`wrote ${OUT} and ${PIN} (document sha256 ${sha.slice(0, 12)}…)`);
} else if (mode === 'check') {
  const committed = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  const committedPin = existsSync(PIN) ? readFileSync(PIN, 'utf8').trim().split(' ')[0] : '';
  const sameTypes = committed.replace(/^\/\/ Document sha256 .*\n/m, '') === types.replace(/^\/\/ Document sha256 .*\n/m, '');
  if (sameTypes && committedPin === sha) {
    console.log(`api types current (document sha256 ${sha.slice(0, 12)}…)`);
  } else {
    console.error(`api types drift: ${sameTypes ? 'the pin' : 'the generated types'} differ from the document (sha256 ${sha.slice(0, 12)}…, pinned ${committedPin.slice(0, 12) || 'none'}…). Run: npm run types:api -- <path-or-url> [commit]`);
    process.exit(1);
  }
} else {
  console.error(`unknown mode ${mode}`);
  process.exit(2);
}
