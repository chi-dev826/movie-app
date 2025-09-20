import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import './styles/App.css';

function App() {
  return (
    <div>
      <Header />
      <main className="pt-20">
        {/* ヘッダーの高さ分だけコンテンツ開始位置を調整 */}
        <Outlet /> {/* ここに子ルートのコンポーネントが描画される */}
      </main>
    </div>
  );
}

export default App;
