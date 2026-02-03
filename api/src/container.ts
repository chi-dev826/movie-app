import { MovieController } from "@/presentation/controllers/movie.controller";
import { MovieService } from "@/application/usecases/movie.service";
import { TmdbRepository } from "@/infrastructure/repositories/tmdb.repository";
import { EigaComController } from "@/presentation/controllers/eigaCom.controller";
import { EigaComService } from "@/application/usecases/eigaCom.service";
import { EigaComRepository } from "@/infrastructure/repositories/eigaCom.repository";
import { GoogleSearchController } from "@/presentation/controllers/googleSearch.controller";
import { GoogleSearchService } from "@/application/usecases/googleSearch.service";
import { GoogleSearchRepository } from "@/infrastructure/repositories/googleSearch.repository";
import { YoutubeRepository } from "@/infrastructure/repositories/youtube.repository";

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
