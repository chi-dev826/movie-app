import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/messages";
import { GetFullMovieDataUseCase } from "../../application/usecases/movie/getFullMovieData.usecase";
import { GetHomePageMovieListUseCase } from "../../application/usecases/movie/getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "../../application/usecases/movie/getUpcomingMovieList.usecase";
import { SearchMoviesUseCase } from "../../application/usecases/movie/searchMovies.usecase";
import { GetNowPlayingMoviesUseCase } from "../../application/usecases/movie/getNowPlayingMovies.usecase";
import { SearchMoviesByPersonUseCase } from "../../application/usecases/movie/searchMoviesByPerson.usecase";
import { GetMovieListByIdsUseCase } from "../../application/usecases/movie/getMovieListByIds.usecase";

export class MovieController {
  constructor(
    private readonly getFullMovieDataUseCase: GetFullMovieDataUseCase,
    private readonly getHomePageMovieListUseCase: GetHomePageMovieListUseCase,
    private readonly getUpcomingMovieListUseCase: GetUpcomingMovieListUseCase,
    private readonly searchMoviesUseCase: SearchMoviesUseCase,
    private readonly getNowPlayingMoviesUseCase: GetNowPlayingMoviesUseCase,
    private readonly searchMoviesByPersonUseCase: SearchMoviesByPersonUseCase,
    private readonly getMovieListByIdsUseCase: GetMovieListByIdsUseCase,
  ) {}

  async getMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { movieId } = req.params;
      if (!movieId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_ID_REQUIRED });
      }

      const movieDetails = await this.getFullMovieDataUseCase.execute(
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

      const searchResults = await this.searchMoviesUseCase.execute(query);
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

      const movies = await this.searchMoviesByPersonUseCase.execute(name);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }

  async getMovieList(req: Request, res: Response, next: NextFunction) {
    try {
      const movieList = await this.getHomePageMovieListUseCase.execute();
      res.json(movieList);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const upcomingMovies = await this.getUpcomingMovieListUseCase.execute();
      res.json(upcomingMovies);
    } catch (error) {
      next(error);
    }
  }

  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const nowPlayingMovies = await this.getNowPlayingMoviesUseCase.execute();
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

      const movies = await this.getMovieListByIdsUseCase.execute(movieIds);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }
}
