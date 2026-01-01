import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movie.service";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/messages";

export class MovieController {
  private readonly movieService: MovieService;

  constructor(movieService: MovieService) {
    this.movieService = movieService;
  }

  async getMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { movieId } = req.params;
      if (!movieId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_ID_REQUIRED });
      }

      const movieDetails = await this.movieService.getFullMovieData(
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
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.SEARCH_QUERY_REQUIRED });
      }

      const searchResults = await this.movieService.searchMovies(query);
      res.json(searchResults);
    } catch (error) {
      next(error);
    }
  }

  async searchMoviesByPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.query.name as string;
      if (!name) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Person name is required" });
      }

      const movies = await this.movieService.searchMoviesByPersonName(name);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }

  async getMovieList(req: Request, res: Response, next: NextFunction) {
    try {
      const movieList = await this.movieService.getHomePageMovieList();
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

  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const nowPlayingMovies = await this.movieService.getNowPlayingMovies();
      res.json(nowPlayingMovies);
    } catch (error) {
      next(error);
    }
  }

  async getMovieListByIds(req: Request, res: Response, next: NextFunction) {
    try {
      const idsParam = req.query.ids as string;
      if (!idsParam) {
        return res.json([]);
      }

      const movieIds = idsParam
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));

      if (movieIds.length === 0) {
        return res.json([]);
      }

      const movies = await this.movieService.getMovieListByIds(movieIds);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }
}
