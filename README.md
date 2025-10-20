# 🎬 Movie App

TMDB APIを利用して構築された、モダンな映画情報ブラウジングアプリケーションです。

このプロジェクトは、洗練されたUIとスムーズなUX（ユーザー体験）の実現を目指しています。React、TypeScript、Tailwind CSSなどの現代的な技術スタックで構築されています。

## ✨ 主な機能

- **人気映画の表示**: 話題の映画をダイナミックなスライダーで表示
- **キーワード検索**: インクリメンタルサーチによる高速な映画検索
- **映画詳細**: あらすじ、評価、関連作品、シリーズ作品などの詳細情報を表示
- **予告編再生**: YouTubeの予告編をモーダルウィンドウで再生
- **レスポンシブデザイン**: PCからモバイルまで、様々なデバイスに最適化されたレイアウト

## 🛠️ 技術スタック

| カテゴリ   | 技術・ライブラリ                                                                                             |
| :--------- | :----------------------------------------------------------------------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, React Router, Tailwind CSS, TanStack Query, Framer Motion, Swiper.js, Lucide React |
| **Backend**  | Node.js, Express, TypeScript, Axios                                                                        |
| **API**      | The Movie Database (TMDB) API                                                                                |

## 🚀 セットアップと実行方法

### 1. 前提条件

- Node.js (v18以降を推奨)
- npm (Node.jsに付属)
- [The Movie Database (TMDB)](https://www.themoviedb.org/) のAPIキー

### 2. インストール

プロジェクトのルートディレクトリで、以下のコマンドを実行して、フロントエンドとバックエンドのすべての依存関係をインストールします。

```bash
npm run install:all
```

### 3. 環境変数の設定

プロジェクトのルートディレクトリに`.env`ファイルを作成し、あなたのTMDB APIキーを設定します。

まず、`.env.example`をコピーしてください。

```bash
copy .env.example .env
```

次に、作成された`.env`ファイルを開き、`your_tmdb_api_key_here`の部分をあなたのキーに書き換えてください。

```
# .env
VITE_TMDB_API_KEY="your_tmdb_api_key_here"
```

### 4. 開発サーバーの起動

以下のコマンド一つで、フロントエンドとバックエンドの開発サーバーを同時に起動できます。

```bash
npm run dev
```

- フロントエンドは `http://localhost:5173` でアクセス可能になります。
- バックエンドサーバーは `http://localhost:3000` で起動します。