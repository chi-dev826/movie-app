# ルーティングエラーの修正に関する解説

## 1. 発生していたエラー

**エラーメッセージ:**
`Uncaught TypeError: Cannot destructure property 'basename' of 'React10.useContext(...)' as it is null.`

### エラーの根本原因

このエラーは、`react-router-dom`ライブラリの`<Link>`コンポーネントが、自身の動作に必須である「ルーターの情報（コンテキスト）」を見つけられずに発生していました。

`<Link>`コンポーネントは、どのURLに遷移すべきかといった情報を、親コンポーネントのツリーを遡って探します。この情報は`<RouterProvider>`（または`<BrowserRouter>`）によって提供されます。

エラー発生前の`main.tsx`では、以下のような構造になっていました。

```tsx
// 変更前のmain.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header> // <--- RouterProviderの外側にいる
      <RouterProvider router={router} />
    </Header>
  </StrictMode>,
);
```

この構造では、`<Header>`コンポーネントが`<RouterProvider>`の**外側（親）**に配置されています。そのため、`<Header>`コンポーネントの内部で使われている`<Link>`コンポーネントは、ルーターの情報を受け取ることができず、「コンテキストがnullである」というエラーを引き起こしていました。

## 2. 変更内容

この問題を解決し、「全てのページで共通のヘッダーを表示する」という目的を達成するため、`react-router-dom`の推奨する「レイアウトルート（Layout Route）」という設計パターンに基づいて、以下の2ファイルを修正しました。

### a. `src/components/Header.tsx` の修正

- **変更点:**
  - `props.children`を受け取って表示する仕組みを削除しました。
  - 代わりに、`react-router-dom`が提供する`<Outlet />`コンポーネントをインポートし、ページのコンテンツを表示したい位置に配置しました。

- **解説:**
  - `<Outlet />`は、子ルートのコンポーネントが描画される場所を示す「プレースホルダー」として機能します。これにより、`<Header>`は純粋に共通のレイアウトを提供する役割に専念できます。

```tsx
// 変更後のHeader.tsx
import { Link, Outlet } from 'react-router-dom'; // Outletをインポート
// ...
function Header() {
  return (
    <header>
      <nav>{/* ... */}</nav>
      <main>
        <Outlet /> {/* ここに子コンポーネントが描画される */}
      </main>
    </header>
  );
}
```

### b. `src/main.tsx` の修正

- **変更点:**
  - アプリケーションの最上位に`<RouterProvider>`を配置するように変更しました。
  - ルーターの定義（`createBrowserRouter`）をネスト（入れ子）構造にしました。`<Header>`を共通レイアウトの親ルート(`element`)とし、その`children`プロパティに各ページ（`App`や`MovieDetailPage`）のルート定義を配列として格納しました。

- **解説:**
  - この構造により、まず親である`<Header>`が描画され、その中の`<Outlet />`の部分に、URLに応じた子コンポーネント（`App`など）が描画されます。
  - `<Header>`自身も`<RouterProvider>`の内側にいるため、その中の`<Link>`コンポーネントは正しくルーターのコンテキストにアクセスできるようになり、エラーが解消されます。

```tsx
// 変更後のmain.tsx
const router = createBrowserRouter([
  {
    element: <Header />, // 親ルートがヘッダー
    children: [ // 子ルートが各ページ
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/movie/:movieId',
        element: <MovieDetailPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} /> // RouterProviderが最上位
  </StrictMode>,
);
```

## 結論

今回の修正は、単にエラーを解消するだけでなく、`react-router-dom`の設計思想に沿った、より宣言的で保守性の高いコード構成へのリファクタリングです。今後の機能追加や変更にも柔軟に対応しやすい、拡張性の高い基盤が整いました。
