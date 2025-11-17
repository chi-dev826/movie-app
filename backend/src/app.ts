import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Local Vite dev server
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
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
