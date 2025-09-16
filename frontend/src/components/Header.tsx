import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 text-white p-4 shadow-lg backdrop-blur-md z-50">
        <div className="flex items-center">
          <nav className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-lg font-bold hover:text-gray-300 transition-colors">
              <Home size={20} />
              <span>ホーム</span>
            </Link>
            <button 
              onClick={handleSearchClick}
              className="flex items-center space-x-2 text-lg font-bold hover:text-gray-300 transition-colors"
            >
              <Search size={20} />
              <span>検索</span>
            </button>
          </nav>
        </div>
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Header;
