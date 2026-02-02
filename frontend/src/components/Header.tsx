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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#0B0B0B]/80 backdrop-blur-xl border-white/5 py-3 md:py-4'
            : 'bg-transparent border-transparent py-5 md:py-6'
        }`}
      >
        <div className="container px-4 mx-auto md:px-8 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={APP_PATHS.HOME} className="relative z-50 flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-0 bg-blue-500/20 blur-xl group-hover:opacity-100" />
                <img
                  src={logo}
                  alt="PEEK Logo"
                  className="relative w-8 h-8 transition-transform duration-500 md:w-10 md:h-10 group-hover:scale-105 group-hover:rotate-3"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white transition-all duration-300 group-hover:text-blue-200">
                PEEK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden gap-8 md:flex lg:gap-12">
              {[
                { path: APP_PATHS.HOME, label: 'ホーム' },
                { path: APP_PATHS.MOVIES.UPCOMING, label: '公開予定' },
                { path: APP_PATHS.WATCH_LIST, label: 'ウォッチリスト' },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="relative py-2 group">
                  <span className="relative z-10 text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
                    {link.label}
                  </span>
                  {/* Ambient Glow Effect */}
                  <div className="absolute inset-0 transition-colors duration-300 rounded-lg -inset-x-4 bg-white/0 blur-lg group-hover:bg-white/5" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 blur-[1px] transition-all duration-300 group-hover:opacity-100 group-hover:blur-[2px] shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-400 transition-all duration-300 rounded-full group hover:text-white"
                aria-label="検索"
              >
                <div className="relative">
                  <div className="absolute inset-0 transition-transform duration-300 scale-0 rounded-full bg-white/10 blur-md group-hover:scale-150" />
                  <MagnifyingGlassIcon className="relative w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="relative z-50 p-2 text-gray-300 transition-colors md:hidden group"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="メニュー"
              >
                <div className="absolute inset-0 transition-transform duration-300 scale-0 rounded-full bg-white/5 blur-md group-hover:scale-125" />
                {isMobileMenuOpen ? (
                  <XMarkIcon className="relative w-7 h-7" />
                ) : (
                  <Bars3Icon className="relative w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (OLED Cinema Style) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] w-full h-[100dvh] bg-[#000000] md:hidden flex flex-col justify-start pt-32 px-8"
            >
              <nav className="flex flex-col gap-8">
                {[
                  { path: APP_PATHS.HOME, label: 'Home', jp: 'ホーム' },
                  { path: APP_PATHS.MOVIES.UPCOMING, label: 'Coming Soon', jp: '公開予定' },
                  { path: APP_PATHS.WATCH_LIST, label: 'Watchlist', jp: 'ウォッチリスト' },
                ].map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    >
                      <Link
                        to={link.path}
                        className="flex flex-col items-start group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span
                          className={`text-5xl font-bold tracking-tighter transition-all duration-300 ${
                            isActive
                              ? 'text-blue-500 scale-105 origin-left'
                              : 'text-white/40 group-hover:text-white'
                          }`}
                        >
                          {link.label}
                        </span>

                        {/* Japanese Label as small accent */}
                        <span
                          className={`text-sm tracking-widest mt-2 uppercase transition-colors duration-300 ${
                            isActive ? 'text-blue-400' : 'text-zinc-600 group-hover:text-zinc-400'
                          }`}
                        >
                          {link.jp}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Decorative Glow */}
              <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-blue-900/20 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
