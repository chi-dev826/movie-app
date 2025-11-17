import { MovieController } from "./controllers/movie.controller";
import { MovieService } from "./services/movie.service";
import { TmdbRepository } from "./lib/tmdb.repository";
import { EigaComController } from "./controllers/eigaCom.controller";
import { EigaComService } from "./services/eigaCom.service";
import { ScrapeEigaComClient } from "./lib/scrapeEigaComClient";
import { GoogleSearchController } from "./controllers/googleSearch.controller";
import { GoogleSearchService } from "./services/googleSearch.service";
import { MovieAssembler } from "./mappers/movie.assembler";
import { MovieFormatter } from "./mappers/movie.formatter";

export const tmdbRepository = new TmdbRepository();
export const scrapeEigaComClient = new ScrapeEigaComClient();

export const movieService = new MovieService(tmdbRepository);
export const eigaComService = new EigaComService(scrapeEigaComClient);

export const movieFormatter = new MovieFormatter();
export const movieAssembler = new MovieAssembler(movieService, movieFormatter);

export const movieController = new MovieController(movieAssembler);
export const eigaComController = new EigaComController(eigaComService);

export const googleSearchService = new GoogleSearchService();
export const googleSearchController = new GoogleSearchController(
  googleSearchService,
);
