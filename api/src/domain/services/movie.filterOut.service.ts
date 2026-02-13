import { MovieEntity } from "../models/movie";

export class MovieFilterOutService {
  /**
   * 指定された映画IDをリストから除外する
   */
  public filter(
    movies: readonly MovieEntity[],
    movieIdToFilter: number,
  ): readonly MovieEntity[] {
    return movies.filter((movie) => movie.id !== movieIdToFilter);
  }

  /**
   * 重複している映画をリストから除外する
   */
  public deduplicate(movies: readonly MovieEntity[]): readonly MovieEntity[] {
    const uniqueMovies = new Map<number, MovieEntity>();
    movies.forEach((movie) => uniqueMovies.set(movie.id, movie));
    return Array.from(uniqueMovies.values());
  }
}
