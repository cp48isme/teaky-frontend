import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import { bannedCallRules } from './eslint.banned.js'

// CI runs this config alone: `npx eslint -c eslint.banned.config.js .`
export default defineConfig([
  globalIgnores(['dist']),
  { linterOptions: { reportUnusedDisableDirectives: 'off' } },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: { parser: tseslint.parser, ecmaVersion: 2020, sourceType: 'module' },
    // Registered, not enabled: the source has eslint-disable comments naming
    // its rules, which must resolve for the file to lint at all.
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: bannedCallRules,
  },
])
