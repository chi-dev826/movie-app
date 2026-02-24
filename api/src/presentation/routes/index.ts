import { Router } from "express";
import { createMovieRoutes } from "./movie.routes";
import { Dependencies } from "../../container";

export const createApiRoutes = (dependencies: Dependencies): Router => {
  const router = Router();

  router.use(createMovieRoutes(dependencies));

  return router;
};
