import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { movieController, eigaComController } from "../container";

const router = Router();

router.get(
  "/movie/:movieId/full",
  (req: Request, res: Response, next: NextFunction) =>
    movieController.getMovieDetails(req, res, next),
);
router.get(
  "/movie/:movieId/eiga-com-news",
  (req: Request, res: Response, next: NextFunction) =>
    eigaComController.getEigaComNews(req, res, next),
);
router.get("/search/movie", (req: Request, res: Response, next: NextFunction) =>
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
