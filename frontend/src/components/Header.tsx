import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import SearchOverlay from '@/features/search/components/SearchOverlay';

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
      <header className="fixed top-0 left-0 z-50 w-full p-4 text-white bg-gray-900 shadow-lg bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center">
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-lg font-bold transition-colors hover:text-gray-300"
            >
              <Home size={20} />
              <span>ホーム</span>
            </Link>
            <button
              onClick={handleSearchClick}
              className="flex items-center space-x-2 text-lg font-bold transition-colors hover:text-gray-300"
            >
              <Search size={20} />
              <span>検索</span>
            </button>
            <Link
              to="/watch-list"
              className="flex items-center space-x-2 text-lg font-bold transition-colors hover:text-gray-300"
            >
              <BookmarkIcon className="w-5 h-5" />
              <span>ウォッチリスト</span>
            </Link>
          </nav>
        </div>
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Header;
