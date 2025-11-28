import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  movieController,
  eigaComController,
  googleSearchController,
} from "../container";
import { API_PATHS } from "../../shared/constants/routes";

const router = Router();

router.get(
  API_PATHS.MOVIE.FULL,
  (req: Request, res: Response, next: NextFunction) =>
    movieController.getMovieDetails(req, res, next),
);
router.get(
  API_PATHS.MOVIE.EIGA_COM_NEWS,
  (req: Request, res: Response, next: NextFunction) =>
    eigaComController.getEigaComNews(req, res, next),
);
router.get(
  API_PATHS.MOVIE.ANALYSIS,
  (req: Request, res: Response, next: NextFunction) =>
    googleSearchController.getMovieAnalysis(req, res, next),
);
router.get(API_PATHS.SEARCH.MOVIE, (req: Request, res: Response, next: NextFunction) =>
  movieController.searchMovies(req, res, next),
);
router.get(API_PATHS.MOVIES.HOME, (req: Request, res: Response, next: NextFunction) =>
  movieController.getMovieList(req, res, next),
);
router.get(
  API_PATHS.MOVIES.UPCOMING,
  (req: Request, res: Response, next: NextFunction) =>
    movieController.getUpcomingMovies(req, res, next),
);

router.get(
  API_PATHS.MOVIES.NOW_PLAYING,
  (req: Request, res: Response, next: NextFunction) =>
    movieController.getNowPlayingMovies(req, res, next),
);

export default router;
