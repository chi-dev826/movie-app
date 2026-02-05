import { MovieController } from "@/presentation/controllers/movie.controller";
import { EigaComController } from "@/presentation/controllers/eigaCom.controller";
import { EigaComService } from "@/application/usecases/eigaCom.service";
import { EigaComRepository } from "@/infrastructure/repositories/eigaCom.repository";
import { GoogleSearchController } from "@/presentation/controllers/googleSearch.controller";
import { GoogleSearchService } from "@/application/usecases/googleSearch.service";
import { GoogleSearchRepository } from "@/infrastructure/repositories/googleSearch.repository";
import { YoutubeRepository } from "@/infrastructure/repositories/youtube.repository";

// New imports for Movie features
import { GetFullMovieDataUseCase } from "@/application/usecases/movie/getFullMovieData.usecase";
import { GetHomePageMovieListUseCase } from "@/application/usecases/movie/getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "@/application/usecases/movie/getUpcomingMovieList.usecase";
import { SearchMoviesUseCase } from "@/application/usecases/movie/searchMovies.usecase";
import { GetNowPlayingMoviesUseCase } from "@/application/usecases/movie/getNowPlayingMovies.usecase";
import { SearchMoviesByPersonUseCase } from "@/application/usecases/movie/searchMoviesByPerson.usecase";
import { GetMovieListByIdsUseCase } from "@/application/usecases/movie/getMovieListByIds.usecase";

import { TmdbRepository } from "@/infrastructure/repositories/tmdb.repository";
import { NodeCacheRepository } from "@/infrastructure/repositories/cache/nodeCache.repository";
import { MovieEnricher } from "@/domain/services/movie.enricher";

// リポジトリのインスタンス化
export const cacheRepository = new NodeCacheRepository();
export const tmdbRepository = new TmdbRepository(cacheRepository);
export const eigaComRepository = new EigaComRepository();
export const googleSearchRepository = new GoogleSearchRepository();
export const youtubeRepository = new YoutubeRepository();

// Domain Services
export const movieEnricher = new MovieEnricher(tmdbRepository);

// UseCases
export const getFullMovieDataUseCase = new GetFullMovieDataUseCase(
  tmdbRepository,
  youtubeRepository,
  movieEnricher,
);
export const getHomePageMovieListUseCase = new GetHomePageMovieListUseCase(
  tmdbRepository,
);
export const getUpcomingMovieListUseCase = new GetUpcomingMovieListUseCase(
  tmdbRepository,
  youtubeRepository,
);
export const searchMoviesUseCase = new SearchMoviesUseCase(tmdbRepository);
export const getNowPlayingMoviesUseCase = new GetNowPlayingMoviesUseCase(
  tmdbRepository,
);
export const searchMoviesByPersonUseCase = new SearchMoviesByPersonUseCase(
  tmdbRepository,
);
export const getMovieListByIdsUseCase = new GetMovieListByIdsUseCase(
  tmdbRepository,
);

// Services (Existing)
export const eigaComService = new EigaComService(eigaComRepository);
export const googleSearchService = new GoogleSearchService(
  googleSearchRepository,
);

// コントローラのインスタンス化
export const movieController = new MovieController(
  getFullMovieDataUseCase,
  getHomePageMovieListUseCase,
  getUpcomingMovieListUseCase,
  searchMoviesUseCase,
  getNowPlayingMoviesUseCase,
  searchMoviesByPersonUseCase,
  getMovieListByIdsUseCase,
);
export const eigaComController = new EigaComController(eigaComService);
export const googleSearchController = new GoogleSearchController(
  googleSearchService,
);
