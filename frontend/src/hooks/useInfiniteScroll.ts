import { useEffect, useRef } from 'react';

/**
 * 無限スクロールの検知（IntersectionObserver）とフェッチ発火を担うカスタムフック
 * @param hasNextPage 次のページが存在するか
 * @param isFetchingNextPage 現在次ページを取得中か
 * @param fetchNextPage 次ページを取得する関数
 * @returns 監視対象要素（番兵）にアタッチするためのRef
 */
export const useInfiniteScroll = (
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void,
  options?: IntersectionObserverInit,
) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 交差しており、かつ次のページがあり、かつ現在取得中でない場合のみ発火
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        // 先読みの範囲を広げる (800px 手前で発火)
        rootMargin: '0px 0px 800px 0px',
        ...options,
      },
    );

    observer.observe(sentinel);
    // 依存配列に isFetchingNextPage を入れることで、読み込み完了後も依然として画面内に番兵がいる場合に即座に再評価される
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return sentinelRef;
};
