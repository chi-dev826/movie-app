import { Request, Response, NextFunction } from "express";
import GoogleSearchService from "../services/googleSearch.service";

export class GoogleSearchController {
  private googleSearchService: GoogleSearchService;

  constructor(googleSearchService: GoogleSearchService) {
    this.googleSearchService = googleSearchService;
  }

  async getMovieAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const movieTitle = req.query.title as string;
      const results =
        await this.googleSearchService.getMovieAnalysis(movieTitle);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
