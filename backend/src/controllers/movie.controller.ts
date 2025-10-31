import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movie.service";

export class MovieController {
  private readonly movieService: MovieService;

  constructor(movieService: MovieService) {
    this.movieService = movieService;
  }

  async getMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { movieId } = req.params;
      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }

      const movieDetails = await this.movieService.getMovieDetails(
        Number(movieId),
      );
      res.json(movieDetails);
    } catch (error) {
      next(error);
    }
  }

  async searchMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const searchResults = await this.movieService.searchMovies(query);
      res.json(searchResults);
    } catch (error) {
      next(error);
    }
  }

  async getMovieList(req: Request, res: Response, next: NextFunction) {
    try {
      const movieList = await this.movieService.getMovieList();
      res.json(movieList);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const upcomingMovies = await this.movieService.getUpcomingMovieList();
      res.json(upcomingMovies);
    } catch (error) {
      next(error);
    }
  }
}
