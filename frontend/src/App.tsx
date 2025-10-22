import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen text-white bg-black">
      <Header />
      <main className="pt-14">
        {/* ヘッダーの高さ分だけコンテンツ開始位置を調整 */}
        <Outlet /> {/* ここに子ルートのコンポーネントが描画される */}
      </main>
    </div>
  );
}

export default App;
