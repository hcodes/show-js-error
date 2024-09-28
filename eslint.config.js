import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.*',
      'dist',
      'node_modules',
      'tests'
    ]
  },
  {
    files: ['**/*.{js,mjs,ts}']
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
