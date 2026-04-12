import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ルート遷移時にスクロール位置をページ先頭へリセットする。
 * SPAではブラウザのデフォルトスクロール復元が効かないため、明示的に制御する。
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
