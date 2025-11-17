import { Router } from "express";
import movieRoutes from "./movie.routes";
import fs from "fs";
import path from "path";

const router = Router();

// デバッグ用エンドポイント
router.get("/debug", (_req, res) => {
  const rootDir = process.cwd();
  const allFiles = [];

  function readDirRecursive(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            // node_modules は除外
            if (file !== "node_modules") {
              readDirRecursive(filePath);
            }
          } else {
            // ルートからの相対パスを格納
            allFiles.push(path.relative(rootDir, filePath));
          }
        } catch (e) {
          // 権限エラーなどでstatが取れないファイルはスキップ
        }
      });
    } catch (e) {
      // 権限エラーなどでreaddirができないディレクトリはスキップ
    }
  }

  readDirRecursive(rootDir);

  res.json({
    message: "File structure on Vercel",
    cwd: rootDir,
    files: allFiles.sort(),
  });
});

router.use(movieRoutes);

export default router;
