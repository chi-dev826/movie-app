# Reactフックの依存関係による無限ループ問題のトラブルシューティング

## 1. 概要

映画検索ページにおいて、検索を実行した際にAPIリクエストが無限に発生し、結果が表示されないという問題が発生した。

---

## 2. 発生した問題

### 現象

1.  検索ページでキーワードを入力し検索を実行すると、画面に「読み込み中...」と表示されたまま応答がなくなる。
2.  ブラウザの開発者ツールでネットワークタブを確認したところ、同一の検索API (`/api/search/movie`) へのGETリクエストが、短時間に大量に送信され続けていた。

### 初期調査

Playwrightのブラウザ操作ツールで挙動を確認した際、以下の点が観測された。

*   `browser_wait_for(textGone = "読み込み中...")` がタイムアウトし、ローディング状態が終了しない。
*   `browser_network_requests()` の結果、同じAPIエンドポイントへのリクエストが数十回以上繰り返されていることが判明した。

これらの状況から、コンポーネント内でstateの更新とAPIリクエストがループしている、いわゆる「無限ループ」が発生していると推測した。

---

## 3. 原因分析

コードを調査した結果、問題の根本原因はReactのカスタムフックと`useEffect`の依存関係の誤った設計にあることが判明した。

**問題のコードフロー:**

1.  **`SearchPage.tsx`**: 検索ロジックを実行する`useEffect`が、`handleSearch`関数に依存していた。

    ```tsx
    // SearchPage.tsx
    const { searchMovies } = useMovies();

    const handleSearch = useCallback(
      async (searchQuery: string) => { /* ... */ },
      [searchMovies], // 問題点1: searchMoviesに依存
    );

    useEffect(() => {
      if (query) {
        handleSearch(query);
      }
    }, [query, handleSearch]); // 問題点2: handleSearchに依存
    ```

2.  **`useMovies.ts`**: `SearchPage`で呼ばれるカスタムフック。このフックが返す`searchMovies`関数が、`useCallback`でメモ化されていなかった。

    ```tsx
    // useMovies.ts (修正前)
    export const useMovies = () => {
      // ...
      const searchMovies = async (query: string): Promise<Movie[]> => {
        // ...
      };

      return { ..., searchMovies }; // 問題点3: レンダリングの度に新しい関数が生成される
    };
    ```

**無限ループの連鎖反応:**

1.  `SearchPage`コンポーネントがレンダリングされる。
2.  `useMovies()`フックが呼ばれ、**新しい`searchMovies`関数のインスタンス**が生成される。
3.  `searchMovies`が変わったため、`SearchPage`の`useCallback`が**新しい`handleSearch`関数のインスタンス**を生成する。
4.  `handleSearch`が変わったため、`useEffect`の依存関係が変更されたとReactが判断し、エフェクトが実行される。
5.  `useEffect`内で`handleSearch`が実行され、ローディング状態などのstateが更新される。
6.  state更新により`SearchPage`が再レンダリングされる。
7.  **上記ステップ1に戻り、ループが永続する。**

---

## 4. 解決策

カスタムフック`useMovies`内で返される`searchMovies`関数を、`useCallback`でラップしメモ化することで、関数の参照一貫性を保証した。

**修正ファイル:** `frontend/src/hooks/useMovies.ts`

```tsx
// 修正前
const searchMovies = async (query: string): Promise<Movie[]> => {
  // ...
};
```

```tsx
// 修正後
import { useCallback } from 'react'; // useCallbackをインポート

// ...

const searchMovies = useCallback(async (query: string): Promise<Movie[]> => {
  try {
    const results = await searchMoviesApi(query);
    return results;
  } catch (err) {
    console.error('Search error:', err);
    throw new Error('検索中にエラーが発生しました');
  }
}, []); // 依存配列を空に設定
```

この修正により、`searchMovies`関数は初回レンダリング時にのみ生成され、以降はコンポーネントが再レンダリングされても同じインスタンスが使い回される。その結果、`handleSearch`関数も再生成されなくなり、`useEffect`の不要な再実行が防がれ、無限ループが解消された。

---

## 5. 修正後の動作確認

修正を適用後、再度ブラウザ操作で検索機能を検証したところ、以下の正常な動作が確認できた。

*   検索APIへのリクエストが1回のみ送信される。
*   「読み込み中...」の表示が即座に消え、検索結果が正しく画面に表示される。

---

## 6. 学習ポイント

*   **カスタムフックから関数を返す際の注意点:**
    カスタムフックが返す関数を、他のコンポーネントの`useEffect`の依存配列に含める場合、その関数は`useCallback`でメモ化し、参照一貫性を保つことが極めて重要である。さもなければ、意図しない無限ループを引き起こす原因となる。

*   **依存配列の役割の再確認:**
    `useEffect`や`useCallback`の依存配列は、単に変数を並べるだけでなく、「参照の安定性」まで考慮して設計する必要がある。特に、配列やオブジェクト、関数といった参照型を依存配列に含める際は注意が必要である。

*   **問題発生時のデバッグアプローチ:**
    「画面が固まる」「同じAPIリクエストが大量に飛ぶ」といった現象は、無限ループの典型的な兆候である。このような場合、React DevToolsのプロファイラや、ブラウザのネットワークタブを監視し、どのコンポーネントが再レンダリングを繰り返しているかを特定することが、問題解決への近道となる。
