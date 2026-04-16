import { useHomePage } from '@/hooks/useMovies';
import HeroSwiper from './components/HeroSwiper';
import UpcomingSpotlightSection from './components/UpcomingSpotlightSection';
import NowPlayingSpotlightSection from './components/NowPlayingSpotlightSection';
import TrendingSection from './components/TrendingSection';
import RecentlyAddedSection from './components/RecentlyAddedSection';

/**
 * HomePage
 *
 * 映画アプリのホーム画面を構成するトップレベルのページコンポーネント。
 * バックエンドの `GET /api/home` BFFエンドポイントを利用して一括でデータを取得。
 *
 * レイアウト構成:
 * 1. HeroSwiper — 公開中・新着・公開予定がミックスされたバッジ付き大型スワイパー
 * 2. スポットライトセクション — 公開予定・公開中を大型フィーチャー＋横スクロールで強調
 * 3. 通常セクション — 人気映画・高評価等を従来の横スクロールで表示
 *
 * @returns JSX.Element
 */
function HomePage() {
  const { data, isLoading, error } = useHomePage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">エラーが発生しました</h2>
          <p className="mb-4 text-gray-400">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <p className="text-sm text-gray-500">
            バックエンドサーバーが起動していることを確認してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      {/* ヒーロースワイパー（公開中 / 新着 / 公開予定ミックス） */}
      {data.hero.length >= 3 && <HeroSwiper movies={data.hero} />}
      <div className="lg:p-6 xl:p-12 2xl:p-20 2xl:pb-0">
        {/* ✦ スポットライト: 公開予定 */}
        <UpcomingSpotlightSection
          title="公開予定"
          subtitle="まもなく公開される注目作品"
          initialData={data.upcoming}
        />

        {/* ✦ スポットライト: 公開中 */}
        <NowPlayingSpotlightSection
          title="公開中の映画"
          subtitle="今、劇場で観られる映画"
          initialData={data.nowPlaying}
        />

        {/* 人気ランキング */}
        {data.trending && data.trending.movies.length > 0 && (
          <TrendingSection initialData={data.trending} />
        )}

        {/* 新着作品 (2行グリッド横スクロール) */}
        {data.recentlyAdded && data.recentlyAdded.movies.length > 0 && (
          <RecentlyAddedSection initialData={data.recentlyAdded} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
