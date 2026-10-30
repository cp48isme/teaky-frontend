// alert() is banned (30 Oct 2026, ruling R1). Outcomes go through the status
// region: useAction(label, fn) for a mutation, useStatus().announce for
// anything else. This object is shared by eslint.config.js (the full lint) and
// eslint.banned.config.js (the CI gate, which runs only these rules so that
// pre-existing lint debt cannot mask a returning alert()).
const message =
  'alert() is banned: report the outcome through the status region (useAction / useStatus), not a modal.';

export const bannedCallRules = {
  'no-restricted-globals': ['error', { name: 'alert', message }],
  'no-restricted-properties': [
    'error',
    { object: 'window', property: 'alert', message },
    { object: 'globalThis', property: 'alert', message },
  ],
};
