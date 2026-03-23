import { MoviePresenter } from "../../../presentation/presenters/movie.presenter";
import { HomePageResponse } from "../../../../../shared/types/api";
import { GetHomePageMovieListUseCase as PopularUseCase } from "./getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "./getUpcomingMovieList.usecase";
import { GetNowPlayingMoviesUseCase } from "./getNowPlayingMovies.usecase";
import { GetTrendingListUseCase } from "./getTrendingList.usecase";

/**
 * ホーム画面表示用の全データを一括取得・加工するBFFユースケース。
 */
export class GetHomePageUseCase {
  constructor(
    private readonly popularUseCase: PopularUseCase,
    private readonly upcomingUseCase: GetUpcomingMovieListUseCase,
    private readonly nowPlayingUseCase: GetNowPlayingMoviesUseCase,
    private readonly trendingUseCase: GetTrendingListUseCase,
  ) {}

  async execute(): Promise<HomePageResponse> {
    // 既存のユースケースを並列実行 (Orchestration)
    const [popularResponse, upcoming, nowPlaying, trending] = await Promise.all(
      [
        this.popularUseCase.execute(),
        this.upcomingUseCase.execute(),
        this.nowPlayingUseCase.execute(),
        this.trendingUseCase.execute(),
      ],
    );

    const recentlyAdded = popularResponse.recently_added || [];

    // ミックスリストの構築 (表示ロジックは Presenter に委譲)
    const hero = MoviePresenter.toHomeHeroList(
      upcoming,
      nowPlaying,
      recentlyAdded,
    );

    return {
      hero,
      upcoming,
      nowPlaying,
      recentlyAdded,
      trending,
    };
  }
}
