import { GetMovieAnalysisUseCase } from "../../application/usecases/analysis/getMovieAnalysis.usecase";
import { Request, Response, NextFunction } from "express";

export class GoogleSearchController {
  constructor(
    private readonly getMovieAnalysisUseCase: GetMovieAnalysisUseCase,
  ) {}

  async getMovieAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const movieTitle = req.query.title as string;
      const results = await this.getMovieAnalysisUseCase.execute(movieTitle);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
