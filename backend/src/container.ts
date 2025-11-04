import { MovieController } from "./controllers/movie.controller";
import { MovieService } from "./services/movie.service";
import { TmdbRepository } from "./lib/tmdb.repository";
import { EigaComController } from "./controllers/eigaCom.controller";
import { EigaComService } from "./services/eigaCom.service";
import { ScrapeEigaComClient } from "./lib/scrapeEigaComClient";

export const tmdbRepository = new TmdbRepository();
export const scrapeEigaComClient = new ScrapeEigaComClient();

export const movieService = new MovieService(tmdbRepository);
export const eigaComService = new EigaComService(scrapeEigaComClient);

export const movieController = new MovieController(movieService);
export const eigaComController = new EigaComController(eigaComService);
