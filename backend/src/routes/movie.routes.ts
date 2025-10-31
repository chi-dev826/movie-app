import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { MovieController } from "../controllers/movie.controller";
import { MovieService } from "../services/movie.service";
import { TmdbRepository } from "../lib/tmdb.repository";

const router = Router();
const tmdbRepository = new TmdbRepository();
const movieService = new MovieService(tmdbRepository);
const movieController = new MovieController(movieService);

router.get(
  "/movie/:movieId/full",
  (req: Request, res: Response, next: NextFunction) =>
    movieController.getMovieDetails(req, res, next),
);
router.get("/search", (req: Request, res: Response, next: NextFunction) =>
  movieController.searchMovies(req, res, next),
);
router.get("/movies/home", (req: Request, res: Response, next: NextFunction) =>
  movieController.getMovieList(req, res, next),
);
router.get(
  "/movies/upcoming",
  (req: Request, res: Response, next: NextFunction) =>
    movieController.getUpcomingMovies(req, res, next),
);

export default router;
