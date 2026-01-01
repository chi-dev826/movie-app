import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { APP_PATHS } from '@shared/constants/routes';

import SearchOverlay from '../features/search/components/SearchOverlay';
import logo from '/logo.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={APP_PATHS.HOME} className="flex items-center gap-2 z-50">
              <img src={logo} alt="PEEK Logo" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                PEEK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to={APP_PATHS.HOME}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                ホーム
              </Link>
              <Link
                to={APP_PATHS.MOVIES.UPCOMING}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                公開予定
              </Link>
              <Link
                to={APP_PATHS.WATCH_LIST}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                ウォッチリスト
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-300 transition-colors rounded-full hover:text-white hover:bg-white/10"
                aria-label="検索"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-300 transition-colors rounded-full hover:text-white hover:bg-white/10 z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-40 bg-black pt-20 md:hidden"
            >
              <nav className="flex flex-col items-center gap-8 p-8">
                <Link
                  to={APP_PATHS.HOME}
                  className="text-2xl font-medium text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ホーム
                </Link>
                <Link
                  to={APP_PATHS.MOVIES.UPCOMING}
                  className="text-2xl font-medium text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  公開予定
                </Link>
                <Link
                  to={APP_PATHS.WATCH_LIST}
                  className="text-2xl font-medium text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ウォッチリスト
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;