import { MovieController } from "./controllers/movie.controller";
import { MovieService } from "./services/movie.service";
import { TmdbRepository } from "./repositories/tmdb.repository";
import { EigaComController } from "./controllers/eigaCom.controller";
import { EigaComService } from "./services/eigaCom.service";
import { ScrapeEigaComClient } from "./lib/scrapeEigaComClient";
import { GoogleSearchController } from "./controllers/googleSearch.controller";
import { GoogleSearchService } from "./services/googleSearch.service";

// リポジトリのインスタンス化
export const tmdbRepository = new TmdbRepository();

// その他のクライアント
export const scrapeEigaComClient = new ScrapeEigaComClient();

// サービスのインスタンス化
export const movieService = new MovieService(tmdbRepository);
export const eigaComService = new EigaComService(scrapeEigaComClient);

// コントローラのインスタンス化
export const movieController = new MovieController(movieService);
export const eigaComController = new EigaComController(eigaComService);

export const googleSearchService = new GoogleSearchService();
export const googleSearchController = new GoogleSearchController(
  googleSearchService,
);
