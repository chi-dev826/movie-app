import { useEffect, useRef, useCallback } from 'react';
import { Movie } from '@/types/api/dto';
import { PaginatedResponse } from '@/types/api/response';
import { useInfiniteMovieList } from '@/hooks/useMovies';
import SectionHeader from './SectionHeader';
import RankingMovieCard from './RankingMovieCard';

type Props = {
  initialData?: PaginatedResponse<Movie>;
};

export default function TrendingSection({ initialData }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMovieList(
    'trending',
    initialData,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  // snap-mandatoryコンテナではIntersectionObserverが到達不能になるため、
  // スクロール位置の監視で次ページの取得を発火する
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;

    // 残りスクロール可能距離が、コンテナ幅1つ分を切ったらフェッチ
    const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth;
    if (remaining < el.clientWidth) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // initialDataがある場合、マウント時に次ページをバックグラウンドでプリフェッチ
  useEffect(() => {
    if (initialData && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawItems = data ? data.pages.flatMap((page) => page.movies) : [];
  // ページ間で同一映画が重複する可能性があるため、IDベースで排除
  const seen = new Set<number>();
  const items = rawItems.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  if (items.length === 0) return null;

  // 3つずつグループ化
  const popularLists = items.reduce<Movie[][]>((acc, movie, index) => {
    if (index % 3 === 0) acc.push([]);
    acc[acc.length - 1].push(movie);
    return acc;
  }, []);

  return (
    <div className="mt-12 px-4 py-8 rounded-3xl bg-[#131313]">
      <SectionHeader title="今週人気" type="trending" />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide"
      >
        {popularLists.map((list, groupIndex) => (
          <div key={groupIndex} className="flex-none flex flex-col gap-4 w-full snap-start">
            {list.map((movie, itemIndex) => (
              <RankingMovieCard
                key={movie.id}
                movie={movie}
                rank={groupIndex * 3 + itemIndex + 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
