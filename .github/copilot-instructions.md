# `movie-app` の AI コーディングエージェント向けガイドライン

`movie-app` のコードベースへようこそ！このドキュメントは、AI コーディングエージェントがプロジェクトのアーキテクチャ、ワークフロー、コーディング規約に沿って効率的に作業できるようにするためのガイドラインを提供します。

---

## プロジェクト概要

`movie-app` は、映画を閲覧・発見するためのフルスタックアプリケーションです。TMDB API などの外部 API を利用して映画データを取得し、モダンでレスポンシブなユーザーインターフェースを提供します。プロジェクトは以下の 3 つの主要部分に分かれています。

1.  **フロントエンド (`frontend/`)**: React をベースにしたアプリケーションで、TypeScript, Vite, Tailwind CSS, TanStack Query を使用しています。
2.  **バックエンド (`api/`)**: 外部 API リクエストのプロキシとして機能し、ビジネスロジックを処理する Node.js/TypeScript サーバー。Express フレームワークを使用し、ドメイン駆動設計（DDD）に基づいたアーキテクチャを採用しています。
3.  **共有 (`shared/`)**: フロントエンドとバックエンドで共有される TypeScript の型定義や定数を管理します。

---

## ディレクトリ構造と主要ファイル

- **`frontend/`**
  - `src/main.tsx`: アプリケーションのエントリーポイント。
  - `src/App.tsx`: ルーティングを含む主要コンポーネント。
  - `src/features/`: 各機能（ホームページ、映画詳細など）ごとのモジュール。
    - `home/`, `movie-detail/`, `search/`
  - `src/components/`: 複数の機能で再利用される共通 UI コンポーネント。
  - `src/hooks/`: カスタムフック（例: `useMovies.ts`）。
  - `src/services/`: バックエンド API との通信ロジック（例: `movieApi.ts`）。

- **`api/`**
  - `server.ts`: Express サーバーの起動ファイル。
  - `src/application/`: ユースケース層。具体的なアプリケーションのタスクを記述します。
  - `src/domain/`: ドメイン層。ビジネスロジックのコア（エンティティ、リポジトリインターフェース、ドメインサービス）を定義します。
  - `src/infrastructure/`: インフラストラクチャ層。外部 API クライアント（例: `tmdb.client.ts`）やデータベースとの接続、リポジトリの実装を記述します。
  - `src/presentation/`: プレゼンテーション層。ルーティング（`*.routes.ts`）やコントローラーを定義します。

- **`shared/`**
  - `types/`: フロントエンドとバックエンドで共有される型定義。
    - `domain/`: ビジネスロジックで利用するドメインモデルの型。
    - `api/`: DTO (Data Transfer Object) など、API のリクエスト・レスポンスに関する型。
    - `external/`: TMDB など、外部サービスとのやり取りで使う型。
  - `constants/`: ルーティングパスや HTTP ステータスコードなどの共有定数。

---

## 開発ワークフロー

### ビルドと実行

- **フロントエンド**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **バックエンド**:
  ```bash
  cd api
  npm install
  npm run start
  ```

### テスト

- **フロントエンド (E2E)**:
  ```bash
  cd frontend
  npm run test
  ```
- **バックエンド (Integration)**:
  ```bash
  cd api
  npm run test
  ```

---

## プロジェクト固有の規約

### 型定義 (TypeScript)

- すべての共有型定義は `shared/types/` に配置します。
- **命名規則**:
  - `T`プレフィックス: 型エイリアス (`type TMovie = { ... }`)
  - `I`プレフィックス: インターフェース (`interface IMovieRepository { ... }`)
- 新しい型を追加する場合は、その型が属するドメイン（`domain`, `api`, `external`）を考慮し、適切なファイルに配置してください。

### API 統合

- **バックエンド**: 外部 API との通信は `api/src/infrastructure/lib/` に配置されたクライアント（`tmdb.client.ts` など）で一元管理します。
- **フロントエンド**: バックエンドとの通信は `frontend/src/services/movieApi.ts` を介して行います。

### 状態管理

- フロントエンドのデータ取得とキャッシングには TanStack Query (React Query) を使用します。非同期の状態管理は、`frontend/src/hooks/` にあるカスタムフックに集約することが推奨されます。

### スタイリング

- フロントエンドのスタイリングには TailwindCSS を使用します。ユーティリティファーストのアプローチを徹底し、原則としてカスタム CSS の追加は避けてください。

---

## AI エージェント向けの注意点

- **ディレクトリ構造の遵守**: 上記のディレクトリ構造と命名規則に必ず従ってください。
- **関心の分離**: バックエンドは DDD の原則に基づき、各層（`application`, `domain`, `infrastructure`, `presentation`）の責務を明確に分離してください。
- **型の追加**: 新しい型は `shared/types/` の適切なサブディレクトリに追加してください。
- **依存関係の追加**: 新しい依存関係を導入する場合は、事前に承認を得てください。

---

不明点や確認事項がある場合は、`README.md` を参照するか、プロジェクトメンテナーに相談してください。
