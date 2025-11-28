import { Router } from "express";
import movieRoutes from "./movie.routes";

const router = Router();

router.use(movieRoutes);

export default router;
