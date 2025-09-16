# Movie App

映画情報を検索・閲覧できるWebアプリケーションです。

## 技術スタック

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **API**: The Movie Database (TMDB) API

## アプリケーションの起動方法

### 前提条件

- Node.js (v18以上)
- Python (v3.8以上)
- npm または yarn

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd movie-app
```

### 2. フロントエンドの起動

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

### 3. バックエンドの起動

```bash
# バックエンドディレクトリに移動
cd backend

# 仮想環境の作成（初回のみ）
python -m venv venv

# 仮想環境の有効化
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt

# 開発サーバーの起動
uvicorn main:app --reload
```

バックエンドは `http://localhost:8000` で起動します。

### 4. 環境変数の設定

バックエンドでTMDB APIを使用する場合は、`.env`ファイルを作成してAPIキーを設定してください：

```bash
# backend/.env
TMDB_API_KEY=your_tmdb_api_key_here
```

## 利用可能なスクリプト

### フロントエンド

- `npm run dev` - 開発サーバーの起動
- `npm run build` - プロダクションビルド
- `npm run preview` - ビルド結果のプレビュー
- `npm run lint` - ESLintによるコードチェック
- `npm run typecheck` - TypeScriptの型チェック

### バックエンド

- `uvicorn main:app --reload` - 開発サーバーの起動
- `pytest` - テストの実行
- `ruff check` - コードのリント

## プロジェクト構成

```
movie-app/
├── frontend/          # React フロントエンド
│   ├── src/
│   │   ├── components/    # React コンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── services/      # API サービス
│   │   └── types/         # TypeScript 型定義
│   └── package.json
└── backend/           # FastAPI バックエンド
    ├── main.py        # メインアプリケーション
    ├── requirements.txt
    └── tests/         # テストファイル
```

## 開発について

### ESLint設定の拡張

本番アプリケーションを開発する場合は、型を意識したリントルールを有効にすることをお勧めします：

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

React固有のリントルールについては、[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) と [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) のインストールも検討してください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
