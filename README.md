# Movie App

TMDB APIを主軸としつつ、複数の情報源を統合して豊かな映画体験を提供する、モダンな映画情報ブラウジングアプリケーションです。

このプロジェクトは、単なる情報表示に留まらず、パフォーマンスと洗練されたUX（ユーザー体験）を両立させることを目指しています。React、TypeScript、Node.jsなどの現代的な技術スタック上に、多くの設計的工夫を凝らして構築されています。

## 主な機能

- **人気映画の表示**: 話題の映画をダイナミックなスライダーで表示
- **キーワード検索**: インクリメンタルサーチによる高速な映画検索
- **映画詳細**: あらすじ、評価、関連作品、シリーズ作品、配信サービスなどの網羅的な情報を表示
- **予告編再生**: YouTubeの予告編をモーダルウィンドウで再生
- **ニュースと分析**: 映画.comのニュースやGoogle検索による分析記事など、多角的な情報を提供
- **レスポンシブデザイン**: PCからモバイルまで、様々なデバイスに最適化されたレイアウト

## アーキテクチャと設計思想

このアプリケーションの核となるのは、パフォーマンスとユーザー体験を最大化するための設計思想です。

### バックエンド

- **多層的なデータソースの統合**:
  - TMDB APIをベースに、**映画.com**のニュース（Webスクレイピング）や**Google検索**結果を組み合わせ、情報の付加価値を高めています。

- **パフォーマンスを最大化する並列処理とキャッシュ**:
  - `Promise.allSettled`を多用し、関連データ（映画詳細、画像、類似作品など）を並列で一括取得することで、APIの待ち時間を最小化しています。
  - `node-cache`を用いた**サーバーサイドキャッシュ**（TTL: 24時間）により、外部APIへのリクエスト数を大幅に削減し、高速なレスポンスを実現しています。

- **データの品質担保**:
  - 外部APIから取得したYouTubeの予告編が「非公開」でないかを事前に検証し、再生エラーを未然に防ぎます。

- **責務の分離 (Service/Repository パターン)**:
  - ビジネスロジック(`MovieService`)と外部API通信(`TmdbRepository`)を明確に分離し、コードの保守性とテスト容易性を高めています。

### フロントエンド

- **モダンなデータ取得手法 (TanStack Query)**:
  - データ取得ロジックをカスタムフックにカプセル化し、UIコンポーネントをデータ取得の複雑さから解放しています。
  - 構造化されたクエリキーを採用し、キャッシュの管理を容易かつ堅牢にしています。

- **二段構えのキャッシュ戦略**:
  - バックエンドのキャッシュに加え、TanStack Queryによる**クライアントサイドキャッシュ**（staleTime: 1時間）を設定。ユーザーの体感速度を向上させつつ、APIへのリクエストをさらに抑制しています。

- **UXを考慮した動的なクエリ実行**:
  - `enabled`オプションを活用し、必要なタイミングでのみAPIリクエストを実行することで、無駄な通信を徹底的に排除しています。

## 技術スタック

| カテゴリ | 技術・ライブラリ |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, React Router, Tailwind CSS, TanStack Query, Framer Motion, Swiper.js |
| **Backend** | Node.js, Express, TypeScript, Axios, Cheerio, node-cache |
| **共通** | ESLint, Prettier, TypeScript |
| **API** | The Movie Database (TMDB) API, Google Custom Search API, YouTube Data API |

## セットアップと実行方法

### 公開URL

このアプリケーションは以下のURLで公開されており、実際に試すことができます。

[https://movie-app-frontend.vercel.app/](https://movie-app-frontend.vercel.app/)

### 1. 前提条件

- Node.js (v18以降を推奨)
- npm (Node.jsに付属)
- [The Movie Database (TMDB)](https://www.themoviedb.org/) のAPIキー

### 2. インストール

プロジェクトのルートディレクトリで以下のコマンドを実行すると、npm workspacesがフロントエンドとバックエンド両方の依存関係をインストールします。

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトのルートディレクトリに`.env`ファイルを作成し、あなたのTMDB APIキーを設定します。

まず、`.env.example`をコピーしてください。（お使いのOSに合わせてコマンドを選択してください）

- **Windows (Command Prompt):**
  ```bash
  copy .env.example .env
  ```
- **Windows (PowerShell), macOS, Linux:**
  ```bash
  cp .env.example .env
  ```

次に、作成された`.env`ファイルを開き、`your_tmdb_api_key_here`の部分をあなたのキーに書き換えてください。

```
# .env
VITE_TMDB_API_KEY="your_tmdb_api_key_here"
```

### 4. 開発サーバーの起動

フロントエンドとバックエンドのサーバーは、それぞれ別のターミナルで起動する必要があります。

**ターミナル1: フロントエンド (`/frontend`)**

```bash
npm run dev --workspace=frontend
```

> フロントエンドは `http://localhost:5173` でアクセス可能になります。

**ターミナル2: バックエンド (`/api`)**

```bash
npm run dev --workspace=api
```

> バックエンドサーバーは `http://localhost:3000` で起動します。
