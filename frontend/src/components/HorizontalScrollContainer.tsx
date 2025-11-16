import { useRef, useState, useCallback, useEffect, ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type Props = {
  children: ReactNode;
};

const HorizontalScrollContainer = ({ children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      const isScrollabe = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(isScrollabe && el.scrollLeft > 0);
      setCanScrollRight(isScrollabe && el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      }
    };
  }, [checkScrollability, children]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; //画面幅の80%スクロール
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute top-0 z-10 hidden w-12 h-full transition-opacity duration-300 opacity-0 -left-10 group-hover:opacity-100 xl:block"
        >
          <ChevronLeftIcon className="w-12 h-12 mx-auto text-white" />
        </button>
      )}
      <div
        ref={containerRef}
        className="flex p-2 space-x-8 overflow-x-auto lg:p-4 scrollbar-hide scroll-smooth"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute top-0 z-10 hidden w-12 h-full transition-opacity duration-300 opacity-0 -right-10 group-hover:opacity-100 xl:block"
        >
          <ChevronRightIcon className="w-12 h-12 mx-auto text-white" />
        </button>
      )}
    </div>
  );
};

export default HorizontalScrollContainer;
