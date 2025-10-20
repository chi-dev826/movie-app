import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  // ESCキーでオーバーレイを閉じる
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // オーバーレイが開いた時にフォーカスを検索ボックスに移動
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md p-6 mx-4 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">映画を検索</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="映画のタイトルを入力..."
              className="w-full px-4 py-3 pl-12 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <Search
              className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2"
              size={20}
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              検索
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-gray-400 transition-colors hover:text-white"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchOverlay;
