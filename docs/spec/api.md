# バックエンド仕様書 (API)

## 1. 概要
本バックエンドは、映画情報（TMDB）、ニュース（映画.com）、動画（YouTube）、関連記事（SerpApi）を統合し、フロントエンドに最適化されたデータ（DTO）を提供するAPIサーバーです。

## 2. アーキテクチャ (オニオンアーキテクチャ)

### 2.1. Domain Layer
- **エンティティ:** `Movie`, `MovieDetail`, `Article`, `Video`, `Collection`
- **リポジトリ・インターフェース:** `ITMDBRepository`, `IEigaComRepository`, `IGoogleSearchRepository`, `IYouTubeRepository`, `ICacheRepository`
- **ドメインサービス:** `MovieRecommendationService`, `UpcomingMovieService` (集計・比較ロジックをカプセル化)

### 2.2. Application Layer (UseCases)
ユースケースがビジネスロジックの最小単位となり、複数のリポジトリを統合（Enrichment）します。
- `GetFullMovieDataUseCase`: TMDBの詳細 + 予告編 + 配信情報を結合。
- `GetHomePageUseCase`: 複数のリスト（NowPlaying, Upcoming, Trending）を並列取得して統合。
- `GetUpcomingMovieListUseCase`: 将来の公開作品をフィルタリングし、UI用のバッジ情報を付与。

### 2.3. Infrastructure Layer
- **TMDBClient:** TMDB APIとのHTTP通信、エラーハンドリング。
- **EigaComClient:** 映画.com の HTML スクレイピングによるニュース取得。
- **SerpApiClient:** Google 検索結果からの関連記事抽出。
- **Cache:** メモリ（または将来的にRedis）によるAPIレスポンスのキャッシュ。

### 2.4. Presentation Layer
- **Express Routes / Controllers:** HTTPリクエストのバリデーションとユースケースの実行。
- **Response Builders:** ドメインモデルをフロントエンドが使いやすい `DTO` に変換（`MovieResponseBuilder`）。

## 3. 主要ロジック
- **データ・エンリッチメント:** `TMDB` から基本情報を取得し、同時に `EigaCom` や `YouTube` から補足情報を非同期で並列取得・マージする。
- **DI (Dependency Injection):** `container.ts` で全依存関係を解決。環境変数に応じてモックと本番実装を切り替え可能。
