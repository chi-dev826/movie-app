import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen text-white bg-gray-950 overflow-x-hidden">
      <ScrollRestoration />
      <Header />
      <main className="pt-14">
        {/* ヘッダーの高さ分だけコンテンツ開始位置を調整 */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
