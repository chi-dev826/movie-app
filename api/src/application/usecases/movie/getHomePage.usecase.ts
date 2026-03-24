import { MovieEntity } from "../../../domain/models/movie";
import { GetHomePageMovieListUseCase as PopularUseCase } from "./getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "./getUpcomingMovieList.usecase";
import { GetNowPlayingMoviesUseCase } from "./getNowPlayingMovies.usecase";
import { GetTrendingListUseCase } from "./getTrendingList.usecase";

/**
 * ホーム画面表示用の全データを一括取得するドメイン関心事のオーケストレーション。
 */
export type HomePageData = {
  recentlyAdded: MovieEntity[];
  upcoming: (MovieEntity & { logoPath?: string; videoKey?: string })[];
  nowPlaying: MovieEntity[];
  trending: MovieEntity[];
};

export class GetHomePageUseCase {
  constructor(
    private readonly popularUseCase: PopularUseCase,
    private readonly upcomingUseCase: GetUpcomingMovieListUseCase,
    private readonly nowPlayingUseCase: GetNowPlayingMoviesUseCase,
    private readonly trendingUseCase: GetTrendingListUseCase,
  ) {}

  /**
   * 各カテゴリの映画リストを並列取得し、ドメインデータの集合体を返却する。
   * 表示用加工（Heroセクションの構築等）はプレゼンテーション層に委譲する。
   */
  async execute(): Promise<HomePageData> {
    const [recentlyAdded, upcoming, nowPlaying, trending] = await Promise.all([
      this.popularUseCase.execute(),
      this.upcomingUseCase.execute(),
      this.nowPlayingUseCase.execute(),
      this.trendingUseCase.execute(),
    ]);

    return {
      recentlyAdded,
      upcoming,
      nowPlaying,
      trending,
    };
  }
}
