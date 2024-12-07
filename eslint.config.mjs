import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['dist/', '**/*.js'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslintPluginPrettierRecommended,
      eslint.configs.recommended,
      ...tseslint.configs.strict,
    ],
  },
);
