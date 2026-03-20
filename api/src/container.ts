import { MovieController } from "./presentation/controllers/movie.controller";
import { EigaComController } from "./presentation/controllers/eigaCom.controller";
import { GetEigaComNewsUseCase } from "./application/usecases/news/getEigaComNews.usecase";
import { EigaComRepository } from "./infrastructure/repositories/eigaCom.repository";
import { GoogleSearchController } from "./presentation/controllers/googleSearch.controller";
import { GetMovieAnalysisUseCase } from "./application/usecases/analysis/getMovieAnalysis.usecase";
import { GoogleSearchRepository } from "./infrastructure/repositories/googleSearch.repository";
import { YoutubeRepository } from "./infrastructure/repositories/youtube.repository";

// New imports for Movie features
import { GetFullMovieDataUseCase } from "./application/usecases/movie/getFullMovieData.usecase";
import { GetHomePageUseCase } from "./application/usecases/movie/getHomePage.usecase";
import { GetHomePageMovieListUseCase } from "./application/usecases/movie/getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "./application/usecases/movie/getUpcomingMovieList.usecase";
import { SearchMoviesUseCase } from "./application/usecases/movie/searchMovies.usecase";
import { GetNowPlayingMoviesUseCase } from "./application/usecases/movie/getNowPlayingMovies.usecase";
import { SearchMoviesByPersonUseCase } from "./application/usecases/movie/searchMoviesByPerson.usecase";
import { GetMovieWatchListUseCase } from "./application/usecases/movie/getMovieWatchList.usecase";

import { TmdbRepository } from "./infrastructure/repositories/tmdb.repository";
import { NodeCacheRepository } from "./infrastructure/repositories/cache/nodeCache.repository";
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
  // リポジトリのインスタンス化
  const cacheRepository = new NodeCacheRepository();
  const tmdbRepository = new TmdbRepository(cacheRepository);
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
  const systemClock = new SystemClock(); // SystemClockのインスタンス化
  const upcomingMovieService = new UpcomingMovieService(systemClock); // 修正: systemClockを注入

  // UseCases
  const getFullMovieDataUseCase = new GetFullMovieDataUseCase(
    tmdbRepository,
    movieEnrichService,
    movieRecommendationService,
  );
  const getHomePageMovieListUseCase = new GetHomePageMovieListUseCase(
    tmdbRepository,
    systemClock,
  );
  const getUpcomingMovieListUseCase = new GetUpcomingMovieListUseCase(
    tmdbRepository,
    movieEnrichService,
    upcomingMovieService,
    systemClock,
  );
  const getNowPlayingMoviesUseCase = new GetNowPlayingMoviesUseCase(
    tmdbRepository,
  );
  const getHomePageUseCase = new GetHomePageUseCase(
    getHomePageMovieListUseCase,
    getUpcomingMovieListUseCase,
    getNowPlayingMoviesUseCase,
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
    getFullMovieDataUseCase,
    getHomePageUseCase,
    getHomePageMovieListUseCase,
    getUpcomingMovieListUseCase,
    searchMoviesUseCase,
    getNowPlayingMoviesUseCase,
    searchMoviesByPersonUseCase,
    getMovieWatchListUseCase,
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
