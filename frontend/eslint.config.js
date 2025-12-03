import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig, // Prettierとの競合ルールを無効化
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      'check-file': checkFile,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'error', // Prettier違反をESLintエラーとして扱う

      // --- 命名規則の設定 ---
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'], // Reactコンポーネント(Pascal)と定数(UPPER)を許可
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'], // Reactコンポーネント(Pascal)を許可
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'], // インポートされた変数（クラスなど）のPascalCaseを許可
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'], // クラス、インターフェース、型エイリアスはPascalCase
        },
      ],

      // --- ファイル名の命名規則 ---
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/components/**/*.{tsx,jsx}': 'PASCAL_CASE', // コンポーネントファイルはPascalCase
          '**/features/**/components/**/*.{tsx,jsx}': 'PASCAL_CASE',
          '**/hooks/**/*.{ts,tsx}': 'CAMEL_CASE', // フックファイルはcamelCase
          '**/features/**/hooks/**/*.{ts,tsx}': 'CAMEL_CASE',
          '**/utils/**/*.{ts,tsx}': 'CAMEL_CASE', // ユーティリティはcamelCase
          '**/services/**/*.{ts,tsx}': 'CAMEL_CASE', // サービスはcamelCase
        },
        {
          ignoreMiddleExtensions: true, // .test.ts などのミドル拡張子を無視
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE', // フォルダ名は全てkebab-case
        },
      ],
    },
  },
);
