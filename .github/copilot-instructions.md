# `movie-app` の AI コーディングエージェント向けガイドライン

`movie-app` のコードベースへようこそ！このドキュメントは、AI コーディングエージェントがプロジェクトのアーキテクチャ、ワークフロー、コーディング規約に沿って効率的に作業できるようにするためのガイドラインを提供します。

---

## プロジェクト概要

`movie-app` は、映画を閲覧・発見するためのフルスタックアプリケーションです。TMDB API を利用して映画データを取得し、モダンでレスポンシブなユーザーインターフェースを提供します。プロジェクトは以下の 3 つの主要部分に分かれています：

1. **フロントエンド**: React をベースにしたアプリケーションで、TypeScript、TailwindCSS、Vite を使用しています。

   - 配置場所: `frontend/`
   - 主なエントリーポイント: `frontend/src/main.tsx`, `frontend/src/App.tsx`
   - ページ: `frontend/src/pages/`
   - コンポーネント: `frontend/src/components/`

2. **バックエンド**: TMDB API リクエストのプロキシとして機能する Node.js/TypeScript サーバー。

   - 配置場所: `backend/`
   - 主なエントリーポイント: `backend/src/index.ts`
   - サービス: `backend/src/services/`

3. **共通**: 共有 TypeScript 型とユーティリティ。
   - 配置場所: `common/`
   - 型定義: `common/types/`

---

## 開発者向けワークフロー

### ビルドと実行

- **フロントエンド**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **バックエンド**:
  ```bash
  cd backend
  npm install
  npm run start
  ```

### テスト

- **フロントエンドテスト**:
  ```bash
  cd frontend
  npm run test
  ```
- **バックエンドテスト**:
  現在、バックエンドには自動テストが実装されていません。

### デバッグ

- 簡易デバッグには `console.log` を使用してください。
- バックエンドでは、Node.js の `--inspect` フラグを使用してデバッガを利用できます。

---

## プロジェクト固有の規約

### TypeScript

- すべての型定義は `common/types/` に配置されています。
- 型定義は明確に分割されています：
  - `common.ts`: `PaginatedResponse` などの共有型。
  - `country.ts`: 国関連の型。
  - `watch.ts`: 視聴プロバイダー関連の型。
  - `movie/`: 映画固有の型（`images.ts`, `videos.ts` など）。

### API 統合

- TMDB API との統合は `backend/src/services/apiClient.ts` で管理されています。
- API リクエストには必ず `fetchFromApi` ユーティリティを使用してください。

### スタイリング

- フロントエンドのスタイリングには TailwindCSS を使用しています。
- ユーティリティファーストのアプローチを採用し、必要がない限りカスタム CSS は避けてください。

---

## 主なパターンと例

### コンポーネント構造

- コンポーネントは機能やページごとに整理されています。
- 例: `HeroSection` は `frontend/src/components/Home/HeroSection.tsx` に配置されています。

### 状態管理

- データ取得とキャッシングには React Query を使用しています。
- 例: `frontend/src/hooks/useMovies.ts` 内の `useMovies` フック。

### エラーハンドリング

- フロントエンド: ユーザーフレンドリーなエラーメッセージを表示してください。
- バックエンド: エラーをログに記録し、適切な HTTP ステータスコードを返してください。

---

## 外部依存関係

- **TMDB API**: 映画データの取得に使用。
- **Playwright**: フロントエンドのエンドツーエンドテストに使用。

---

## AI エージェント向けの注意点

- ディレクトリ構造と命名規則に必ず従ってください。
- 新しい型を追加する場合は、`common/types/` の適切なファイルに配置してください。
- 新しいコンポーネントは必ず機能的であり、TypeScript を使用してください。
- 新しい依存関係を導入する場合は、事前に承認を得てください。

---

不明点や確認事項がある場合は、`README.md` を参照するか、プロジェクトメンテナーに相談してください。
