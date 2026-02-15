import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/messages";
import { GetFullMovieDataUseCase } from "../../application/usecases/movie/getFullMovieData.usecase";
import { GetHomePageMovieListUseCase } from "../../application/usecases/movie/getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "../../application/usecases/movie/getUpcomingMovieList.usecase";
import { SearchMoviesUseCase } from "../../application/usecases/movie/searchMovies.usecase";
import { GetNowPlayingMoviesUseCase } from "../../application/usecases/movie/getNowPlayingMovies.usecase";
import { SearchMoviesByPersonUseCase } from "../../application/usecases/movie/searchMoviesByPerson.usecase";
import { GetMovieWatchListUseCase } from "../../application/usecases/movie/getMovieWatchList.usecase";

export class MovieController {
  constructor(
    private readonly getFullMovieDataUseCase: GetFullMovieDataUseCase,
    private readonly getHomePageMovieListUseCase: GetHomePageMovieListUseCase,
    private readonly getUpcomingMovieListUseCase: GetUpcomingMovieListUseCase,
    private readonly searchMoviesUseCase: SearchMoviesUseCase,
    private readonly getNowPlayingMoviesUseCase: GetNowPlayingMoviesUseCase,
    private readonly searchMoviesByPersonUseCase: SearchMoviesByPersonUseCase,
    private readonly getMovieWatchListUseCase: GetMovieWatchListUseCase,
  ) {}

  async getMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { movieId } = req.params;
      if (!movieId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_ID_REQUIRED });
      }

      res.json(await this.getFullMovieDataUseCase.execute(Number(movieId)));
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

      res.json(await this.searchMoviesUseCase.execute(query));
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

      res.json(await this.searchMoviesByPersonUseCase.execute(name));
    } catch (error) {
      next(error);
    }
  }

  async getMovieList(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await this.getHomePageMovieListUseCase.execute());
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await this.getUpcomingMovieListUseCase.execute());
    } catch (error) {
      next(error);
    }
  }

  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await this.getNowPlayingMoviesUseCase.execute());
    } catch (error) {
      next(error);
    }
  }

  async getMovieWatchList(req: Request, res: Response, next: NextFunction) {
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

      res.json(await this.getMovieWatchListUseCase.execute(movieIds));
    } catch (error) {
      next(error);
    }
  }
}
