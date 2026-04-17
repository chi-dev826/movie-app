# フロントエンド仕様書

## 1. 概要
本フロントエンドは、バックエンドAPIから提供される集約された映画情報を、モダンでレスポンシブなUIで提供するSPA（Single Page Application）です。

## 2. アーキテクチャ (Feature-Based Structure)
各機能（Feature）が、UI（Components）、データ取得（Hooks）、ビジネスロジックをカプセル化しています。

### 2.1. 主要機能 (Features)
- **Home:** `HeroSwiper` による注目作品の紹介と、各カテゴリ（上映中、近日公開、トレンド）の横スクロールセクション。
- **Movie Detail:** 映画の詳細情報、予告編再生、キャスト一覧、関連記事（ニュース、分析）の統合表示。
- **Search:** キーワード検索および人物名検索機能。
- **Upcoming List:** 月別の公開予定カレンダー形式の表示。
- **Watch List:** ユーザーが保存した映画の一覧表示（Local Storage 連携）。

### 2.2. 状態管理 & Hooks
- **useMovies:** API通信（fetch）とローディング・エラー状態の管理。
- **useWatchList:** ローカルストレージと同期したウォッチリストの状態管理。
- **useInfiniteScroll:** 一覧画面における無限スクロールロジック。

### 2.3. コンポーネント設計 (Atomic-ish)
- **Common:** `Header`, `HorizontalScrollContainer`, `ScrollToTop` などの共通部品。
- **Movie Card:** `ResponsiveMovieTile`, `MoviePoster`, `MovieBackdrop` など、用途に合わせた映画カード部品。
- **Video Player:** YouTube 予告編の再生を司るオーバーレイまたは埋め込み部品。

## 3. UI/UX デザイン方針
- **レスポンシブデザイン:** モバイルファーストで設計され、Tailwind CSS を使用。
- **インタラクティブ性:** スワイパー（Swiper.js）、スクロールアニメーション、ホバーエフェクトによる「Alive（生きている）」感の演出。
- **スケルトン表示:** ローディング中の不快感を軽減するためのプレースホルダー（将来的な実装候補）。

## 4. 外部依存
- **React:** UIフレームワーク。
- **Vite:** ビルド・開発ツール。
- **Tailwind CSS:** スタイリング。
- **Swiper:** カルーセル実装。
- **Lucide React:** アイコンセット。
