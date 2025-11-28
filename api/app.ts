import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./src/routes";
import dotenv from "dotenv";
import { HTTP_STATUS } from "@shared/constants/httpStatus";

dotenv.config();

const app = express();

// すべてのオリジンからのアクセスを許可
app.use(cors());

app.use(express.json());

app.use("/api", apiRoutes);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: "Failed to process request", error: err.message });
});

export default app;
