import { Router } from "express";
import movieRoutes from "./movie.routes";

const router = Router();

// デバッグ用エンドポイント
router.get("/debug", (_req, res) => {
  res.json({
    message: "Checking Environment Variables",
    has_vite_tmdb_api_key: !!process.env.VITE_TMDB_API_KEY,
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
  });
});

router.use(movieRoutes);

export default router;
