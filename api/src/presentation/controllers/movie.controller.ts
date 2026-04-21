import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/messages";
import { GetDetailBaseInfoUseCase } from "../../application/usecases/movie/movie-detail/getDetailBaseInfo.usecase";
import { GetDetailResourcesUseCase } from "../../application/usecases/movie/movie-detail/getDetailResources.usecase";
import { GetRecommendationsUseCase } from "../../application/usecases/movie/movie-detail/getRecommendations.usecase";
import { GetHomePageUseCase } from "../../application/usecases/movie/getHomePage.usecase";
import { GetHomePageMovieListUseCase } from "../../application/usecases/movie/getHomePageMovieList.usecase";
import { GetUpcomingMovieListUseCase } from "../../application/usecases/movie/getUpcomingMovieList.usecase";
import { SearchMoviesUseCase } from "../../application/usecases/movie/searchMovies.usecase";
import { GetNowPlayingMoviesUseCase } from "../../application/usecases/movie/getNowPlayingMovies.usecase";
import { SearchMoviesByPersonUseCase } from "../../application/usecases/movie/searchMoviesByPerson.usecase";
import { GetMovieWatchListUseCase } from "../../application/usecases/movie/getMovieWatchList.usecase";
import { GetTrendingListUseCase } from "../../application/usecases/movie/getTrendingList.usecase";
import { MovieResponseBuilder } from "../builders/movieResponse.builder";
import { IClock } from "../../domain/repositories/clock.service.interface";

/**
 * 映画関連のエンドポイントを制御するコントローラー。
 * 責務: HTTPリクエストのハンドリング、例外制御、レスポンス構築の依頼(Builder)。
 */
export class MovieController {
  constructor(
    private readonly getDetailBaseInfoUseCase: GetDetailBaseInfoUseCase,
    private readonly getDetailResourcesUseCase: GetDetailResourcesUseCase,
    private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
    private readonly getHomePageUseCase: GetHomePageUseCase,
    private readonly getHomePageMovieListUseCase: GetHomePageMovieListUseCase,
    private readonly getUpcomingMovieListUseCase: GetUpcomingMovieListUseCase,
    private readonly searchMoviesUseCase: SearchMoviesUseCase,
    private readonly getNowPlayingMoviesUseCase: GetNowPlayingMoviesUseCase,
    private readonly searchMoviesByPersonUseCase: SearchMoviesByPersonUseCase,
    private readonly getMovieWatchListUseCase: GetMovieWatchListUseCase,
    private readonly getTrendingListUseCase: GetTrendingListUseCase,
    private readonly builder: MovieResponseBuilder,
    private readonly clock: IClock,
  ) {}

  /**
   * 映画の詳細ページ用の基本情報を取得する (GET /api/movie/:movieId)
   */
  async getMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.movieId);
      if (!req.params.movieId || isNaN(id)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_ID_REQUIRED });
      }

      const domainData = await this.getDetailBaseInfoUseCase.execute(id);
      const response = this.builder.buildDetails(domainData, this.clock.now());

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 映画の詳細ページ用のリソースを取得する (GET /api/movie/:movieId/resources)
   */
  async getMovieResources(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.movieId);
      if (!req.params.movieId || isNaN(id)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_ID_REQUIRED });
      }

      const domainData = await this.getDetailResourcesUseCase.execute(id);
      const response = this.builder.buildResources(domainData);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 映画の詳細ページ用のおすすめ作品を取得する (GET /api/movie/:movieId/recommendations)
   */
  async getMovieRecommendations(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = Number(req.params.movieId);
      const collectionId = Number(req.params.collectionId);
      if (!req.params.movieId || isNaN(id)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.MOVIE_ID_REQUIRED });
      }

      const domainData = await this.getRecommendationsUseCase.execute(
        id,
        collectionId,
      );
      const response = this.builder.buildRecommendations(domainData);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * キーワード検索 (GET /api/search/movie)
   */
  async searchMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.SEARCH_QUERY_REQUIRED });
      }

      const movies = await this.searchMoviesUseCase.execute(query);
      res.json(this.builder.buildSimpleList(movies));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 人物名での検索 (GET /api/movies/search-by-person)
   */
  async searchMoviesByPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.query.name as string;
      if (!name) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.PERSON_NAME_REQUIRED });
      }

      const movies = await this.searchMoviesByPersonUseCase.execute(name);
      res.json(this.builder.buildSimpleList(movies));
    } catch (error) {
      next(error);
    }
  }

  /**
   * ホーム画面リスト (GET /api/movies/home)
   */
  async getMovieList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const result = await this.getHomePageMovieListUseCase.execute(page);
      res.json({
        recently_added: {
          movies: this.builder.buildSimpleList(result.movies),
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ホーム画面全体のデータ (GET /api/home)
   */
  async getHomePage(req: Request, res: Response, next: NextFunction) {
    try {
      const homeData = await this.getHomePageUseCase.execute();
      const response = this.builder.buildHomePage(homeData, this.clock.now());
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 近日公開予定の映画 (GET /api/movies/upcoming)
   */
  async getUpcomingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page);
      const months = req.query.months ? Number(req.query.months) : undefined;
      const result = await this.getUpcomingMovieListUseCase.execute(
        page,
        months,
      );
      res.json({
        movies: this.builder.buildUpcomingList(result.movies, this.clock.now()),
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 現在上映中の映画 (GET /api/movies/now-playing)
   */
  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const result = await this.getNowPlayingMoviesUseCase.execute(page);
      res.json({
        movies: this.builder.buildSimpleList(result.movies),
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * トレンド映画 (GET /api/movies/trending)
   */
  async getTrendingMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const result = await this.getTrendingListUseCase.execute(page);

      res.json({
        movies: this.builder.buildSimpleList(result.movies),
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ウォッチリストの映画を取得 (GET /api/movies/list)
   */
  async getMovieWatchList(req: Request, res: Response, next: NextFunction) {
    try {
      const idsParam = req.query.ids as string;
      if (!idsParam) return res.json([]);

      const movieIds = idsParam
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));

      if (movieIds.length === 0) return res.json([]);

      const items = await this.getMovieWatchListUseCase.execute(movieIds);
      res.json(this.builder.buildWatchList(items));
    } catch (error) {
      next(error);
    }
  }
}
