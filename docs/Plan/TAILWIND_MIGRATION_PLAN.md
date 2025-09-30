# レスポンシブ対応 兼 Tailwind CSS移行 詳細計画書

## 概要

本計画は、現在のプロジェクトにレスポンシブ対応を施すため、既存のバニラCSSからTailwind CSSへ完全に移行するための手順を定義します。
作業は以下のフェーズで段階的に実行します。

1.  **準備・セットアップ**: 移行の土台を整えます。
2.  **コンポーネント移行**: 小さな部品から主要なレイアウトまで、順に移行します。
3.  **クリーンアップ**: 不要になった古いファイルを削除します。
4.  **最終確認**: 全ての変更が正しく適用されているかを確認します。

---

## ステップ1: 準備とセットアップの確認

- **目的:** スタイルの起点をTailwind CSSに一元化し、移行の土台を整える。

### アクション1.1: `index.css` のクリーンアップ

- **変更理由:** `frontend/src/index.css` をTailwind CSSの純粋なエントリーポイント（起点）にするため、既存のカスタムCSSを削除し、意図しないスタイルの競合を防ぎます。
- **実行ツール:** `write_file`
- **変更前 (`frontend/src/index.css`):**

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .slide-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  }
  ```

- **変更後 (`frontend/src/index.css`):**
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### アクション1.2: 既存CSSのimport文を削除

- **変更理由:** 全てのスタイリングが `index.css` を起点とするTailwind CSSによって管理されるようにするため、各コンポーネントからの個別CSSファイルの読み込みを停止します。
- **実行ツール:** `replace` (各ファイルに対して実行)
- **対象ファイルと変更内容:**
  - **`frontend/src/components/HeroSection.tsx`**
    - **削除する行:** `import '../styles/App.css';`
  - **`frontend/src/components/HeroSwiper.tsx`**
    - **削除する行:** `import '../styles/App.css';`
  - **`frontend/src/components/HomePage.tsx`**
    - **削除する行:** `import '../styles/App.css';`
  - **`frontend/src/components/MovieCard.tsx`**
    - **削除する行:** `import '../styles/App.css';`
  - **`frontend/src/components/MovieDetailPage.tsx`**
    - **削除する行:** `import '../styles/MovieDetailPage.css';`

---

## ステップ2: 再利用可能な最小コンポーネントからの移行

- **目的:** 影響範囲の小さい部品から安全に移行し、Tailwindの扱いに慣れる。

### アクション2.1: `MovieCard.tsx` のリファクタリング

- **変更理由:** プロジェクト内で多用されるコンポーネントをTailwind化することで、効率的にスタイルの一貫性を確保し、後の修正を容易にするため。
- **実行ツール:** `replace`
- **変更内容の例:**
  - **変更前 (JSX):**
    ```jsx
    <div className="movie-img-wrap">
      <img src={...} className="movie-card__image" />
    </div>
    ```
  - **変更前 (`App.css`):**
    ```css
    .movie-img-wrap {
      position: relative;
      min-width: 200px;
      height: 300px;
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .movie-img-wrap:hover {
      transform: scale(1.05);
    }
    ```
  - **変更後 (JSX):**
    ```jsx
    <div className="relative min-w-[200px] h-[300px] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105">
      <img src={...} className="absolute w-full h-full object-cover rounded-2xl" />
    </div>
    ```

---

## ステップ3: 主要ページ・レイアウトコンポーネントの移行

- **目的:** アプリケーションの骨格をレスポンシブ化する。

### アクション3.1: `HomePage.tsx` の映画リストレイアウト変更

- **変更理由:** モバイルからPCまで、画面幅に応じて最適な列数を表示するレスポンシブグリッドレイアウトを実装するため。
- **実行ツール:** `replace`
- **変更内容の例:**
  - **変更前 (JSX):**
    ```jsx
    <div className="movie-list">{/* MovieCardコンポーネントのリスト */}</div>
    ```
  - **変更前 (`App.css`):**
    ```css
    .movie-list {
      display: flex;
      overflow-x: auto;
      gap: 2rem;
    }
    ```
  - **変更後 (JSX):**
    ```jsx
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {/* MovieCardコンポーネントのリスト */}
    </div>
    ```
    _補足: 横スクロールからグリッドレイアウトへ変更する想定の例です。_

---

## ステップ4: 詳細ページなど、特殊なスタイルの移行

- **目的:** 独自のスタイルを持つページの移行を完了させる。

### アクション4.1: `MovieDetailPage.tsx` のレイアウト変更

- **変更理由:** モバイルでは縦積み、PCでは多段組といった、コンテンツ量の多い詳細ページに最適なレスポンシブレイアウトを適用するため。
- **実行ツール:** `replace`
- **変更内容の例:**
  - **変更前 (JSX):**
    ```jsx
    <div className="hero-content">
      <div className="video-container">{/* ... */}</div>
      <div className="hero-metadata">{/* ... */}</div>
    </div>
    ```
  - **変更後 (JSX):**
    ```jsx
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3">{/* ... */}</div>
      <div className="w-full md:w-2/3">{/* ... */}</div>
    </div>
    ```

---

## ステップ5: クリーンアップ

- **目的:** プロジェクトから不要になった古いファイルを削除し、コードベースを清潔に保つ。

### アクション5.1: 不要なCSSファイルの削除

- **変更理由:** 全てのスタイルがTailwind CSSに移行され、既存のCSSファイルは不要になったため。
- **実行ツール:** `run_shell_command`
- **実行コマンド:**
  1.  `del frontend\src\styles\App.css`
  2.  `del frontend\src\styles\MovieDetailPage.css`
  3.  `rmdir frontend\src\styles`

---

## ステップ6: 最終確認

- **目的:** 全ての変更が意図通りに適用され、視覚的なリグレッション（意図しない表示崩れ）がないことを保証する。
- **アクション:** ボスによる手動テスト。
- **確認項目:**
  - アプリケーションの全ページをブラウザで表示する。
  - ブラウザのデベロッパーツールを使い、モバイル、タブレット、PCなど、複数の画面幅で表示を確認する。
  - レイアウト崩れ、スタイルの欠損がないことを確認する。
