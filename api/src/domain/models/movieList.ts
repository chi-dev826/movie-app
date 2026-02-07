import { MovieEntity } from "./movie";
import { Movie as MovieDTO } from "../../../../shared/types/domain";

export class MovieList {
  constructor(private readonly movies: MovieEntity[]) {}

  public get items(): MovieEntity[] {
    return [...this.movies];
  }

  /**
   * 重複を排除した新しいリストを返す
   */
  public deduplicate(): MovieList {
    const uniqueMovies = new Map<number, MovieEntity>();
    this.movies.forEach((movie) => uniqueMovies.set(movie.id, movie));
    return new MovieList(Array.from(uniqueMovies.values()));
  }

  /**
   * 別のMovieListと結合する
   */
  public merge(other: MovieList): MovieList {
    return new MovieList([...this.movies, ...other.movies]);
  }

  /**
   * 配列を追加して結合する
   */
  public addAll(movies: MovieEntity[]): MovieList {
    return new MovieList([...this.movies, ...movies]);
  }

  public toDtoArray(): MovieDTO[] {
    return this.movies.map((m) => m.toDto());
  }
}
