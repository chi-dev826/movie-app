import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./routes/movie.routes";

const app = express();

app.use(
  cors({
    origin: true,
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
