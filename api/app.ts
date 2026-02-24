import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { createApiRoutes } from "./src/presentation/routes";
import { HTTP_STATUS } from "../shared/constants/httpStatus";
import { Dependencies } from "./src/container";

export const createApp = (dependencies: Dependencies) => {
  const app = express();

  // すべてのオリジンからのアクセスを許可
  app.use(cors());

  app.use(express.json());

  app.use("/api", createApiRoutes(dependencies));

  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err.message);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to process request", error: err.message });
  });

  return app;
};
