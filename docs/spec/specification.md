# 映画情報集約システム 全体仕様書

## 1. はじめに
本ドキュメントは、映画情報集約システムの全体構造と、フロントエンド・バックエンド間の共通仕様を定義します。
個別の詳細な実装仕様については、以下のドキュメントを参照してください。

- **[バックエンド仕様書 (API)](./api.md)**: オニオンアーキテクチャ、外部API連携、ユースケースの詳細。
- **[フロントエンド仕様書](./frontend.md)**: 機能ベースのUI構成、状態管理、コンポーネント設計。

## 2. 共通 API 契約 (Contract)
フロントエンドとバックエンドは、`shared/types` で定義された共通の DTO（Data Transfer Object）を使用して通信します。

### 2.1. 主要な API エンドポイント
| カテゴリ | エンドポイント | 説明 |
| :--- | :--- | :--- |
| ホーム | `/api/home` | 全体の統合データ |
| 詳細 | `/api/movie/:id/full` | 映画の詳細・動画・配信情報 |
| 検索 | `/api/search/movie` | キーワード検索 |
| 公開予定 | `/api/movies/upcoming` | 近日公開作品リスト |

### 2.2. 共通ドメイン語彙
- **Movie / MovieDetail**: 映画の基本・詳細エンティティ。
- **Enrichment**: 複数のデータソース（TMDB, YouTube, 映画.com）を統合するプロセス。

## 3. 動作環境 & 技術スタック
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express (Onion Architecture)
- **Deployment**: Vercel
- **Data Sources**: TMDB, YouTube, SerpApi, Eiga.com

## 4. プロジェクトのディレクトリ構成
- `api/`: バックエンドソースコード
- `frontend/`: フロントエンドソースコード
- `shared/`: 両者で共有する型定義と定数
- `docs/`: 仕様書・設計ドキュメント
- `tests/`: 統合テスト、E2Eテスト
