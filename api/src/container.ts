import { MovieController } from "./presentation/controllers/movie.controller";
import { EigaComController } from "./presentation/controllers/eigaCom.controller";
import { GetEigaComNewsUseCase } from "./application/usecases/news/getEigaComNews.usecase";
import { EigaComRepository } from "./infrastructure/repositories/eigaCom.repository";
import { GoogleSearchController } from "./presentation/controllers/googleSearch.controller";
import { GetMovieAnalysisUseCase } from "./application/usecases/analysis/getMovieAnalysis.usecase";
import { GoogleSearchRepository } from "./infrastructure/repositories/googleSearch.repository";
import { YoutubeRepository } from "./infrastructure/repositories/youtube.repository";

// New imports for Movie features
import { GetDetailBaseInfoUseCase } from "./application/usecases/movie/movie-detail/getDetailBaseInfo.usecase";
import { GetDetailResourcesUseCase } from "./application/usecases/movie/movie-detail/getDetailResources.usecase";
import { GetRecommendationsUseCase } from "./application/usecases/movie/movie-detail/getRecommendations.usecase";
import { GetHomePageUseCase } from "./application/usecases/movie/getHomePage.usecase";
import { GetHomePageMovieListUseCase } from "./application/usecases/movie/getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "./application/usecases/movie/getUpcomingMovieList.usecase";
import { SearchMoviesUseCase } from "./application/usecases/movie/searchMovies.usecase";
import { GetNowPlayingMoviesUseCase } from "./application/usecases/movie/getNowPlayingMovies.usecase";
import { SearchMoviesByPersonUseCase } from "./application/usecases/movie/searchMoviesByPerson.usecase";
import { GetMovieWatchListUseCase } from "./application/usecases/movie/getMovieWatchList.usecase";
import { GetTrendingListUseCase } from "./application/usecases/movie/getTrendingList.usecase";
import { MovieResponseBuilder } from "./presentation/builders/movieResponse.builder";

import { TmdbRepository } from "./infrastructure/repositories/tmdb.repository";
import { NodeCacheRepository } from "./infrastructure/repositories/cache/nodeCache.repository";
import { UpstashCacheRepository } from "./infrastructure/repositories/cache/upstashCache.repository";
import { ICacheRepository } from "./domain/repositories/cache.repository.interface";
import { MovieEnrichService } from "./application/services/movie.enrich.service";
import { ArticleEnrichService } from "./application/services/article.enrich.service";
import { IOgpImageProvider } from "./application/services/ogp-image-provider.interface";
import { OgpParser } from "./infrastructure/lib/ogp.parser";
import { MovieRecommendationService } from "./domain/services/movie.recommendation.service";
import { UpcomingMovieService } from "./domain/services/upcomingMovie.service";
import { SystemClock } from "./infrastructure/services/systemClock.service"; // SystemClockのインポート

export interface Dependencies {
  movieController: MovieController;
  eigaComController: EigaComController;
  googleSearchController: GoogleSearchController;
}

export const createContainer = (): Dependencies => {
  // 共通インフラ
  const cacheRepository: ICacheRepository = process.env.UPSTASH_REDIS_REST_URL
    ? new UpstashCacheRepository()
    : new NodeCacheRepository();
  const systemClock = new SystemClock();

  // リポジトリのインスタンス化
  const tmdbRepository = new TmdbRepository(cacheRepository, systemClock);
  const eigaComRepository = new EigaComRepository(cacheRepository);
  const googleSearchRepository = new GoogleSearchRepository(cacheRepository);
  const youtubeRepository = new YoutubeRepository(cacheRepository);

  // Application/Domain Services
  const movieEnrichService = new MovieEnrichService(
    tmdbRepository,
    youtubeRepository,
  );

  const ogpImageProvider: IOgpImageProvider = new OgpParser();
  const articleEnrichService = new ArticleEnrichService(ogpImageProvider);

  const movieRecommendationService = new MovieRecommendationService();
  const upcomingMovieService = new UpcomingMovieService(systemClock);

  // Builders
  const movieResponseBuilder = new MovieResponseBuilder();

  // UseCases
  const getDetailBaseInfoUseCase = new GetDetailBaseInfoUseCase(tmdbRepository);
  const getDetailResourcesUseCase = new GetDetailResourcesUseCase(
    tmdbRepository,
    movieEnrichService,
  );
  const getRecommendationsUseCase = new GetRecommendationsUseCase(
    tmdbRepository,
    movieRecommendationService,
  );
  const getHomePageMovieListUseCase = new GetHomePageMovieListUseCase(
    tmdbRepository,
  );
  const getUpcomingMovieListUseCase = new GetUpcomingMovieListUseCase(
    tmdbRepository,
    movieEnrichService,
    upcomingMovieService,
  );
  const getNowPlayingMoviesUseCase = new GetNowPlayingMoviesUseCase(
    tmdbRepository,
  );
  const getTrendingListUseCase = new GetTrendingListUseCase(tmdbRepository);

  const getHomePageUseCase = new GetHomePageUseCase(
    getHomePageMovieListUseCase,
    getUpcomingMovieListUseCase,
    getNowPlayingMoviesUseCase,
    getTrendingListUseCase,
  );
  const searchMoviesUseCase = new SearchMoviesUseCase(tmdbRepository);
  const searchMoviesByPersonUseCase = new SearchMoviesByPersonUseCase(
    tmdbRepository,
  );
  const getMovieWatchListUseCase = new GetMovieWatchListUseCase(tmdbRepository);

  // New UseCases (Replaced Services)
  const getEigaComNewsUseCase = new GetEigaComNewsUseCase(eigaComRepository);
  const getMovieAnalysisUseCase = new GetMovieAnalysisUseCase(
    googleSearchRepository,
    articleEnrichService,
  );

  // コントローラのインスタンス化
  const movieController = new MovieController(
    getDetailBaseInfoUseCase,
    getDetailResourcesUseCase,
    getRecommendationsUseCase,
    getHomePageUseCase,
    getHomePageMovieListUseCase,
    getUpcomingMovieListUseCase,
    searchMoviesUseCase,
    getNowPlayingMoviesUseCase,
    searchMoviesByPersonUseCase,
    getMovieWatchListUseCase,
    getTrendingListUseCase,
    movieResponseBuilder,
    systemClock,
  );
  const eigaComController = new EigaComController(getEigaComNewsUseCase);
  const googleSearchController = new GoogleSearchController(
    getMovieAnalysisUseCase,
  );

  return {
    movieController,
    eigaComController,
    googleSearchController,
  };
};
