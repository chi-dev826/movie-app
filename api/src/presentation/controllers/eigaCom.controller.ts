import { GetEigaComNewsUseCase } from "../../application/usecases/news/getEigaComNews.usecase";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/messages";

export class EigaComController {
  constructor(private readonly getEigaComNewsUseCase: GetEigaComNewsUseCase) {}

  async getEigaComNews(req: Request, res: Response, next: NextFunction) {
    try {
      const movieTitle = req.query.title as string;
      if (!movieTitle) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_TITLE_REQUIRED });
      }

      const newsItems =
        await this.getEigaComNewsUseCase.execute(movieTitle);
      res.json(newsItems);
    } catch (error) {
      next(error);
    }
  }
}