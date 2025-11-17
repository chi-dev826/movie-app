import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Allow requests from the local Vite dev server and any Vercel deployment of the frontend.
const allowedOriginPattern = /^https:\/\/movie-app-frontend-.*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow local dev server and frontend deployments matching the pattern
      if (origin === 'http://localhost:5173' || allowedOriginPattern.test(origin)) {
        return callback(null, true);
      }
      
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    },
  }),
);
app.use(express.json());

app.use("/api", apiRoutes);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res
    .status(500)
    .json({ message: "Failed to process request", error: err.message });
});

export default app;
