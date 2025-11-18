import { Request, Response, NextFunction } from "express";
import { MovieAssembler } from "../mappers/movie.assembler";

export class MovieController {
  private readonly movieAssembler: MovieAssembler;

  constructor(movieAssembler: MovieAssembler) {
    this.movieAssembler = movieAssembler;
  }

  async getMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { movieId } = req.params;
      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }

      const movieDetails = await this.movieAssembler.assembleFullMovieData(
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

      const searchResults =
        await this.movieAssembler.assembleSearchedMovies(query);
      res.json(searchResults);
    } catch (error) {
      next(error);
    }
  }

  async getMovieList(req: Request, res: Response, next: NextFunction) {
    try {
      const movieList = await this.movieAssembler.assembleMovieList();
      res.json(movieList);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const upcomingMovies =
        await this.movieAssembler.assembleUpcomingMovieList();
      res.json(upcomingMovies);
    } catch (error) {
      next(error);
    }
  }

  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const nowPlayingMovies =
        await this.movieAssembler.assembleNowPlayingMovieList();
      res.json(nowPlayingMovies);
    } catch (error) {
      next(error);
    }
  }
}
