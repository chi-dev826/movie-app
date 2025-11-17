import { EigaComService } from "../services/eigaCom.service";
import { Request, Response, NextFunction } from "express";

export class EigaComController {
  private readonly eigaComService: EigaComService;

  constructor(eigaComService: EigaComService) {
    this.eigaComService = eigaComService;
  }

  async getEigaComNews(req: Request, res: Response, next: NextFunction) {
    try {
      const movieTitle = req.query.title as string;
      if (!movieTitle) {
        return res.status(400).json({ message: "Movie title is required" });
      }

      const newsItems = await this.eigaComService.getEigaComNews(movieTitle);
      res.json(newsItems);
    } catch (error) {
      next(error);
    }
  }
}
