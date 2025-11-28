import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export default async (req: Request, res: Response) => {
  console.log("=== DEBUG LOG START ===");
  try {
    const currentDir = __dirname;
    console.log("Current Dir:", currentDir);
    
    // ディレクトリ探索
    const levels = [".", "..", "../..", "../../..", "../shared", "../../shared", "../../../shared"];
    levels.forEach(p => {
      try {
        const target = path.resolve(currentDir, p);
        const exists = fs.existsSync(target);
        console.log(`Path '${p}' (${target}): ${exists ? "EXISTS" : "NOT FOUND"}`);
        if (exists && fs.lstatSync(target).isDirectory()) {
           // 内容が多すぎるとログが見づらいので最初の20個だけ
           const files = fs.readdirSync(target);
           console.log(`  Contents (${files.length}): ${files.slice(0, 20).join(", ")}`);
        }
      } catch (err) {
        console.log(`  Error checking '${p}':`, err);
      }
    });

  } catch (e) {
    console.error("Logging failed:", e);
  }

  try {
    // appを動的にロードして実行
    // tsconfigで "esModuleInterop": true なので require(...).default が必要
    const app = require("./app").default;
    app(req, res);
  } catch (e: any) {
    console.error("CRITICAL ERROR loading app:", e);
    res.status(500).json({
      status: "CRITICAL_ERROR",
      message: e.message,
      stack: e.stack,
      env: process.env.NODE_ENV
    });
  }
};