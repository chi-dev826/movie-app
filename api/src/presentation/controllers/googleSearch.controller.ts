import { GetMovieAnalysisUseCase } from "../../application/usecases/analysis/getMovieAnalysis.usecase";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/messages";

export class GoogleSearchController {
  constructor(
    private readonly getMovieAnalysisUseCase: GetMovieAnalysisUseCase,
  ) {}

  async getMovieAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const movieTitle = req.query.title as string;
      if (!movieTitle) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_TITLE_REQUIRED });
      }

      const results = await this.getMovieAnalysisUseCase.execute(movieTitle);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
