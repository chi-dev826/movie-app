import { MovieController } from "./controllers/movie.controller";
import { MovieService } from "./services/movie.service";
import { TmdbRepository } from "./repositories/tmdb.repository";
import { EigaComController } from "./controllers/eigaCom.controller";
import { EigaComService } from "./services/eigaCom.service";
import { EigaComRepository } from "./repositories/eigaCom.repository";
import { GoogleSearchController } from "./controllers/googleSearch.controller";
import { GoogleSearchService } from "./services/googleSearch.service";
import { GoogleSearchRepository } from "./repositories/googleSearch.repository";
import { YoutubeRepository } from "./repositories/youtube.repository";

// リポジトリのインスタンス化
export const tmdbRepository = new TmdbRepository();
export const eigaComRepository = new EigaComRepository();
export const googleSearchRepository = new GoogleSearchRepository();
export const youtubeRepository = new YoutubeRepository();

// サービスのインスタンス化
export const movieService = new MovieService(tmdbRepository, youtubeRepository);
export const eigaComService = new EigaComService(eigaComRepository);
export const googleSearchService = new GoogleSearchService(
  googleSearchRepository,
);

// コントローラのインスタンス化
export const movieController = new MovieController(movieService);
export const eigaComController = new EigaComController(eigaComService);
export const googleSearchController = new GoogleSearchController(
  googleSearchService,
);
