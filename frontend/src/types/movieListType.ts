/**
 * ホーム画面などのセクションで表示可能な映画リストの種類
 */
export type MovieListType = 'recently_added' | 'now_playing' | 'trending' | 'upcoming';

/**
 * 無限スクロール（一覧ページ）に対応している映画リストの種類
 * ※ upcoming は専用の一覧ページがあり、無限スクロールには対応していないため除外
 */
export type InfiniteMovieListType = 'recently_added' | 'now_playing' | 'trending';
