import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="pt-16">
        {/* ヘッダーの高さ分だけコンテンツ開始位置を調整 */}
        <Outlet /> {/* ここに子ルートのコンポーネントが描画される */}
      </main>
    </div>
  );
}

export default App;
