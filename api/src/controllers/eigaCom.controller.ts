import { EigaComService } from "@/services/eigaCom.service";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "@shared/constants/httpStatus";
import { ERROR_MESSAGES } from "@/constants/messages";

export class EigaComController {
  private readonly eigaComService: EigaComService;

  constructor(eigaComService: EigaComService) {
    this.eigaComService = eigaComService;
  }

  async getEigaComNews(req: Request, res: Response, next: NextFunction) {
    try {
      const movieTitle = req.query.title as string;
      if (!movieTitle) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_TITLE_REQUIRED });
      }

      const newsItems = await this.eigaComService.getEigaComNews(movieTitle);
      res.json(newsItems);
    } catch (error) {
      next(error);
    }
  }
}
