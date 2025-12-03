import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig, // Prettierとの競合ルールを無効化
    ],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      prettier,
      'check-file': checkFile,
    },
    rules: {
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
          format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'], // 定数用のUPPER_CASE、クラス等のPascalCase、snake_caseを許可
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'], // 関数コンポーネントやクラスコンストラクタのためにPascalCaseを許可
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'], // インポートされた変数（クラスなど）のPascalCaseを許可
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'], // クラス、インターフェース、型エイリアスはPascalCase
        },
        {
          selector: 'objectLiteralProperty',
          format: null, // オブジェクトリテラルのプロパティは任意の形式を許可
        },
      ],

      // --- ファイル名の命名規則 ---
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/*.{ts,js}': 'CAMEL_CASE', // ソースファイルは基本的にcamelCase
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE', // フォルダ名はkebab-case
        },
      ],
    },
  },
);
