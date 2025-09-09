import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 text-white p-4 shadow-lg backdrop-blur-md z-50">
      <div className="container mx-auto flex items-center">
        <nav>
          <Link to="/" className="text-lg font-bold hover:text-gray-300 transition-colors mr-6">
            ホーム
          </Link>
          <Link to="/search" className="text-lg font-bold hover:text-gray-300 transition-colors">
            検索
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
