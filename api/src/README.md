# API サーバー（バックエンド）ドキュメント

## 概要

本ディレクトリは、映画アプリケーションのバックエンド（Node.js/Express）の実装です。

**役割**: フロントエンド向けの BFF（Backend For Frontend）として、複数の外部 API（TMDB、YouTube、SerpAPI、映画.com）を統合し、整理されたデータを提供します。

**設計思想**: Clean Architecture を採用し、ビジネスロジックを外部依存から隔離し、テスト容易性と保守性を確保しています。

---

## ディレクトリ構造と層の責務

```
src/
├── domain/          【最内部】ビジネスロジック・エンティティ・インターフェース
│   ├── constants/   定数（ API フィルタ、TMDB 設定、カテゴリ定義）
│   ├── models/      エンティティ（MovieEntity, MovieDetailEntity, CollectionEntity, ArticleEntity）
│   ├── services/    ビジネスロジック（Enricher, Recommendation, Filter, UpcomingMovie）
│   └── repositories/ インターフェース定義（ITmdbRepository, ICacheRepository）
│
├── application/     【ユースケース層】複数のサービス・リポジトリを調整して機能を実現
│   └── usecases/    7 つのユースケース（映画取得、検索、推奨、ニュース、分析）
│
├── infrastructure/  【外部接続層】外部 API へのアクセス、リポジトリの具体実装、キャッシュ
│   ├── lib/         API クライアント（tmdb, youtube, eigaCom, serpApi）
│   ├── repositories/ リポジトリ実装（TmdbRepository, GoogleSearchRepository など）
│   └── constants/   外部 API の URL 定義
│
└── presentation/    【インターフェース層】Express ルーティング、リクエスト/レスポンス処理
    ├── controllers/ コントローラー（MovieController, EigaComController など）
    ├── routes/      Express ルーティング定義
    └── constants/   HTTP ステータス、エラーメッセージ
```

---

## データフロー（全体を俯瞰）

```
【リクエスト】フロントエンド
        ↓
    [Express ルーター]
    presentation/routes/movie.routes.ts
        ↓
    [コントローラー]
    presentation/controllers/MovieController.tsx
    (リクエストの解釈、ユースケースの選択)
        ↓
    [ユースケース]
    application/usecases/movie/*.usecase.ts
    (複数のサービス・リポジトリを調整)
        ↓
    【リポジトリ】と【ドメインサービス】
    infrastructure/repositories/* と domain/services/*
    (外部 API 呼び出し、キャッシュ、ビジネスロジック)
        ↓
    【レスポンス】フロントエンド へ JSON を返却
```

---

## 外部 API の依存関係

| 外部ソース   | URL                                   | 用途                                             | Client                  | キャッシュ         | 呼び出し頻度          |
| ------------ | ------------------------------------- | ------------------------------------------------ | ----------------------- | ------------------ | --------------------- |
| **TMDB**     | https://api.themoviedb.org/3          | 映画データベース（詳細、画像、予告編、類似作品） | `tmdbApi` (Axios)       | ✅ NodeCache (24h) | 高（毎リクエスト）    |
| **YouTube**  | https://www.googleapis.com/youtube/v3 | 予告編の公開状態確認（ステータスチェック）       | `youtubeApi` (Axios)    | ✅ NodeCache (24h) | 中（Enricher で並行） |
| **SerpAPI**  | https://serpapi.com                   | Google 検索結果スクレイピング（映画考察記事）    | `serpApiClient` (Axios) | ✅ NodeCache (24h) | 低（詳細ページのみ）  |
| **映画.com** | https://eiga.com                      | 映画ニュースのスクレイピング                     | Cheerio                 | ✅ NodeCache (24h) | 低（詳細ページのみ）  |

---

## 層別の責務と構成要素

### 1. Domain Layer（最内部）

**責務**: ビジネスロジック・ルール・エンティティを定義。外部 API に一切依存しない。

| ファイル/フォルダ                          | 説明                                                                 |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `constants/homeCategories.ts`              | ホーム画面で表示するカテゴリ別フィルタ（人気、最近追加、高評価など） |
| `constants/movieRules.ts`                  | 映画検索時のデフォルトフィルタ（投票数下限、公開タイプなど）         |
| `constants/tmdbConfig.ts`                  | TMDB の地域、言語、フェッチページ数等の設定                          |
| `models/movie.ts`                          | 基本的な映画エンティティ（id, title, overview, poster_path など）    |
| `models/movieDetail.ts`                    | 拡張映画エンティティ（cast, crew, runtime, genres など）             |
| `models/collection.ts`                     | 映画シリーズ（複数の映画を持つ）                                     |
| `models/article.ts`                        | ニュース記事エンティティ（title, link, snippet など）                |
| `services/movie.enricher.ts`               | ロゴ画像・予告編を映画に付与（Enrichment パターン）                  |
| `services/movie.recommendation.service.ts` | シリーズ or 類似作品を判定して推奨リストを決定                       |
| `services/movie.filterOut.service.ts`      | 画像なし映画を除外、重複排除                                         |
| `services/upcomingMovie.service.ts`        | 公開予定映画のソート、残り日数計算、バッジ表示ロジック               |
| `repositories/*.interface.ts`              | リポジトリの契約を定義（実装は infrastructure 層）                   |

**重要パターン**:

- **Immutability**: `MovieEntity` は `freeze()` で不変化
- **Factory Pattern**: `MovieFactory` で API レスポンスを Entity へ変換
- **Strategy Pattern**: `MovieRecommendationService` で推奨戦略を選択

---

### 2. Application Layer（ユースケース層）

**責務**: 複数のリポジトリ・サービスを組み合わせてビジネス機能を実現。

| ユースケース                      | 説明                                                     | 依存する主要な層                                          |
| --------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| `getFullMovieData.usecase.ts`     | 映画の詳細ページ用データを取得（詳細 + 推奨 + 配信情報） | TmdbRepository, MovieEnricher, MovieRecommendationService |
| `getHomePageMovieList.usecase.ts` | ホーム画面用映画リスト（4 カテゴリ × 複数ページ）        | TmdbRepository, MovieFilterOutService                     |
| `getUpcomingMovieList.usecase.ts` | 公開予定映画（日本語フィルタ + ロゴ + 予告編）           | TmdbRepository, MovieEnricher, UpcomingMovieService       |
| `getNowPlayingMovies.usecase.ts`  | 現在上映中の映画リスト                                   | TmdbRepository, MovieFilterOutService                     |
| `searchMovies.usecase.ts`         | キーワード検索                                           | TmdbRepository, MovieFilterOutService                     |
| `searchMoviesByPerson.usecase.ts` | 俳優・監督で映画検索                                     | TmdbRepository                                            |
| `getMovieWatchList.usecase.ts`    | ウォッチリスト（複数 ID を一括取得）                     | TmdbRepository                                            |

**処理パターン**:

- **並行処理**: `Promise.all()` で複数ページを並行フェッチ
- **フィルタリング→デデュプリケーション**: `MovieFilterOutService` で順に処理
- **エンリッチメント**: `MovieEnricher` でロゴ・予告編を付与
- **DTO 変換**: 最後に `toDto()` / `toDetailDto()` で共有型へ変換

---

### 3. Infrastructure Layer（外部接続層）

**責務**: 外部 API へのアクセスを実装。Domain エンティティへの変換を実行。

#### 3-1. API クライアント（lib/）

| ファイル            | 用途                                 | 設定                             |
| ------------------- | ------------------------------------ | -------------------------------- |
| `tmdb.client.ts`    | TMDB API 呼び出し                    | Bearer トークン認証、言語: ja-JP |
| `youtube.client.ts` | YouTube データ API（ビデオ状態確認） | API キー認証                     |
| `eigaCom.client.ts` | 映画.com スクレイピング              | Axios インスタンス               |
| `serpApi.client.ts` | SerpAPI（Google 検索）               | API キー認証                     |

#### 3-2. リポジトリ実装（repositories/）

| ファイル                        | 実装する Interface | 外部 API                          |
| ------------------------------- | ------------------ | --------------------------------- |
| `tmdb.repository.ts`            | `ITmdbRepository`  | TMDB API                          |
| `youtube.repository.ts`         | （独自）           | YouTube API                       |
| `googleSearch.repository.ts`    | （独自）           | SerpAPI                           |
| `eigaCom.repository.ts`         | （独自）           | 映画.com + Cheerio スクレイピング |
| `cache/nodeCache.repository.ts` | `ICacheRepository` | メモリキャッシュ（node-cache）    |

#### 3-3. キャッシュ戦略

```
API レスポンス キャッシュ層（NodeCache）
    ↓
キャッシュヒット率: 85～95%
キャッシュ期限: 24 時間（default）
キャッシュキー例:
  - "tmdb:movie:550"
  - "tmdb:discover:popular:page:1"
  - "youtube:status:abc123def"
```

---

### 4. Presentation Layer（インターフェース層）

**責務**: HTTP リクエスト/レスポンス処理、ルーティング、DI。

| ファイル                                | 説明                           |
| --------------------------------------- | ------------------------------ |
| `controllers/MovieController.ts`        | 7 つのエンドポイント処理       |
| `controllers/EigaComController.ts`      | ニュース取得エンドポイント     |
| `controllers/GoogleSearchController.ts` | 映画分析記事検索エンドポイント |
| `routes/movie.routes.ts`                | Express ルーティング定義       |
| `routes/index.ts`                       | ルーター統合                   |
| `constants/messages.ts`                 | エラーメッセージ定数           |

---

## API エンドポイント一覧

```
GET /api/movie/:movieId/full
  → FullMovieData (詳細 + 推奨 + ニュース用 ID)

GET /api/movies/home
  → MovieListResponse (4 カテゴリ × 映画配列)

GET /api/movies/upcoming
  → Movie[] (日本語公開予定映画)

GET /api/movies/now-playing
  → Movie[] (現在上映中の映画)

GET /api/search/movie?q=<query>
  → Movie[] (キーワード検索結果)

GET /api/movies/search-by-person?name=<name>
  → Movie[] (俳優名で検索)

GET /api/movies/list?ids=<id1>,<id2>,...
  → Movie[] (複数 ID ウォッチリスト取得)

GET /api/movie/:movieId/eiga-com-news?title=<title>
  → Article[] (映画.com ニュース)

GET /api/movie/:movieId/movie-analysis?title=<title>
  → Article[] (Google 検索から取得した考察記事)
```

---

## 処理フロー：代表例

### ユースケース: ホーム画面の映画リスト取得

```
Request: GET /api/movies/home
   ↓
【Presentation】MovieController.getMovieList()
   ↓
【Application】GetHomePageMovieListUseCase.execute()
   ↓
   ├─ 4 カテゴリ (popular, recently_added, top_rated, high_rated) × 10 ページ
   │
   ├─ 【Infrastructure】TmdbRepository.getDiscoverMovies() × 40 回
   │  （並行処理、キャッシュあればスキップ）
   │
   ├─ 【Domain】MovieFactory.createFromApiResponse()
   │  （API レスポンス → MovieEntity へ変換）
   │
   ├─ 【Domain】MovieFilterOutService.filterMovieWithoutImages()
   │  （ポスター画像なしの映画を除外）
   │
   ├─ 【Domain】MovieFilterOutService.deduplicate()
   │  （重複排除）
   │
   ├─ MovieEntity[] → MovieDTO[] に変換 (toDto())
   │
   └─ Response: { popular: [], recently_added: [], ... }
```

**処理時間の目安**:

- キャッシュヒット時: 500 ms
- キャッシュミス時: 3～5 秒（並行処理の効果で短縮）

---

## キャッシュ戦略の詳細

### キャッシュの役割

```
1. 外部 API のレート制限対策（TMDB: 1000req/10s）
2. レスポンス速度の向上（キャッシュヒット時: 10倍高速）
3. ネットワークコスト削減
```

### キャッシュヒット・ミスの流れ

```
【リクエスト到達】
   ↓
NodeCache で キャッシュキー検索
   ↓
   ├─ HIT（90%）→ メモリから返却（~10ms）
   │
   └─ MISS（10%）→ 外部 API 呼び出し → キャッシュに保存 → 返却
```

### キャッシュキー例

```
"tmdb:discover:{sort_by}:{page}"
  例: "tmdb:discover:popularity.desc:1"

"tmdb:movie:{movieId}:details"
  例: "tmdb:movie:550:details"

"tmdb:movie:{movieId}:videos"
  例: "tmdb:movie:550:videos"

"youtube:status:{videoKey}"
  例: "youtube:status:dQw4w9WgXcQ"

"google-search:movie-analysis:{title}"
  例: "google-search:movie-analysis:インセプション"
```

---

## エラーハンドリング方針

### エラーの分類と対応

| エラー種別                 | 原因                   | 対応                                          |
| -------------------------- | ---------------------- | --------------------------------------------- |
| **外部 API エラー**        | TMDB が 500 返却       | キャッシュがあれば返却、なければ 500 エラー化 |
| **ネットワークエラー**     | タイムアウト、DNS 失敗 | リトライ（2 回）→ 失敗なら空配列 or null      |
| **バリデーションエラー**   | 不正な movieId         | 400 Bad Request                               |
| **ビジネスロジックエラー** | 映画が見つからない     | 200 OK で空の推奨リスト返却                   |

### エラーハンドリングのコード例

```typescript
// try-catch で全リクエストを保護
async getMovieList(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await this.getHomePageMovieListUseCase.execute());
  } catch (error) {
    next(error); // グローバルエラーハンドラへ
  }
}
```

---

## 依存関係の図（DI コンテナ）

```
【Repositories】
├─ TmdbRepository
│   └─ 依存: tmdbApi (Axios), NodeCache
├─ GoogleSearchRepository
│   └─ 依存: serpApiClient (Axios), NodeCache
├─ EigaComRepository
│   └─ 依存: eigaComClient (Axios), Cheerio, NodeCache
└─ YoutubeRepository
    └─ 依存: youtubeApi (Axios)

【Domain Services】
├─ MovieEnricher
│   └─ 依存: TmdbRepository, YoutubeRepository
├─ MovieRecommendationService
│   └─ 依存: TmdbRepository, MovieFilterOutService
├─ MovieFilterOutService
│   └─ 依存: なし（ pure 関数）
└─ UpcomingMovieService
    └─ 依存: なし（ pure 関数）

【UseCases】
├─ GetFullMovieDataUseCase
│   └─ 依存: TmdbRepository, MovieEnricher, MovieRecommendationService
├─ GetHomePageMovieListUseCase
│   └─ 依存: TmdbRepository, MovieFilterOutService
├─ GetUpcomingMovieListUseCase
│   └─ 依存: TmdbRepository, MovieEnricher, UpcomingMovieService, MovieFilterOutService
├─ GetNowPlayingMoviesUseCase
│   └─ 依存: TmdbRepository, MovieFilterOutService
├─ SearchMoviesUseCase
│   └─ 依存: TmdbRepository, MovieFilterOutService
├─ SearchMoviesByPersonUseCase
│   └─ 依存: TmdbRepository
└─ GetMovieWatchListUseCase
    └─ 依存: TmdbRepository

【Controllers】
├─ MovieController
│   └─ 依存: 全 7 つの UseCase
├─ EigaComController
│   └─ 依存: GetEigaComNewsUseCase
└─ GoogleSearchController
    └─ 依存: GetMovieAnalysisUseCase
```

---

## 新しい機能追加時のチェックリスト

### パターン 1: 新しい映画リスト機能を追加

- [ ] 1. `domain/constants/homeCategories.ts` にフィルタ条件を追加
- [ ] 2. `application/usecases/movie/get〇〇Movies.usecase.ts` を新規作成
- [ ] 3. `presentation/controllers/MovieController.ts` に メソッドを追加
- [ ] 4. `presentation/routes/movie.routes.ts` に ルート定義を追加
- [ ] 5. `api/src/container.ts` に DI 登録
- [ ] 6. `shared/constants/routes.ts` に API_PATHS を追加
- [ ] 7. フロントエンド側：`frontend/src/services/movieApi.ts` に fetch 関数を追加

### パターン 2: 新しい外部 API を統合

- [ ] 1. `api/src/infrastructure/lib/〇〇.client.ts` を新規作成（Axios インスタンス）
- [ ] 2. `api/src/infrastructure/constants/external.ts` に URL を追加
- [ ] 3. `api/src/infrastructure/repositories/〇〇.repository.ts` を新規作成
- [ ] 4. Domain Interface が必要なら `api/src/domain/repositories/〇〇.repository.interface.ts` を作成
- [ ] 5. キャッシュロジックを組み込む（`cache/nodeCache.repository.ts` と連携）
- [ ] 6. エラーハンドリングを実装
- [ ] 7. 既存 UseCase から新リポジトリを呼び出す

---

## 開発ワークフロー

### ローカル開発

```bash
# バックエンド起動
cd api
npm install
npm run start

# ポート: 3001 (デフォルト)
# 環境変数: .env に VITE_TMDB_API_KEY, VITE_YOUTUBE_API_KEY 等を設定
```

### テスト

```bash
npm run test
```

### ログ確認

```
console.log() でサーバーコンソールに出力可能
本番環境では構造化ロギング（Winston 等）の導入推奨
```

---

## FAQ

**Q: 外部 API が落ちたときはどうなる？**
A: キャッシュがあれば古いデータを返却。ない場合はエラーをフロントエンドへ返し、ユーザーには「接続エラー」メッセージを表示。

**Q: キャッシュ期限をカスタマイズしたい**
A: `infrastructure/repositories/cache/nodeCache.repository.ts` の `set()` メソッド第 3 引数（秒単位）を変更。

**Q: 新しいカテゴリを追加したい**
A: `domain/constants/homeCategories.ts` に新規キーを追加するだけで OK。UseCase は汎用的に実装済み。

**Q: キャッシュをクリアしたい**
A: 開発環境ではサーバー再起動でクリア。本番環境では Redis 導入後に手動フラッシュ可能。

---
