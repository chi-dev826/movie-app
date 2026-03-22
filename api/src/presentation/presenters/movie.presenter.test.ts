import { MoviePresenter } from "./movie.presenter";
import { MovieEntity } from "../../domain/models/movie";
import { MovieMapper } from "../mappers/movie.mapper";

describe("MoviePresenter", () => {
  const fixedToday = new Date("2026-03-20T00:00:00Z");

  const createMovie = (overrides: Partial<MovieEntity> = {}): MovieEntity => {
    return new MovieEntity(
      overrides.id ?? 1,
      overrides.title ?? "テスト映画",
      overrides.originalTitle ?? "Test Movie",
      overrides.originalLanguage ?? "ja",
      overrides.overview ?? "概要です。",
      overrides.posterPath ?? "/poster.jpg",
      overrides.backdropPath ?? "/backdrop.jpg",
      overrides.releaseDate ?? "2026-03-25",
      overrides.voteAverage ?? 8.0,
      overrides.genreIds ?? [1, 2],
    );
  };

  describe("toUpcomingMovie", () => {
    it("should calculate upcoming metadata correctly", () => {
      const movie = createMovie();
      const dto = MovieMapper.toBffDto(movie);
      const result = MoviePresenter.toUpcomingMovie(dto, fixedToday);

      expect(result.days_until_release).toBe(5);
      expect(result.upcoming_badge_label).toBe("公開予定");
      expect(result.release_date_display).toBe("3月25日(水)");
    });

    it("should handle released movies as null for upcoming metadata", () => {
      const pastMovie = createMovie({
        releaseDate: "2026-03-10",
      });
      const dto = MovieMapper.toBffDto(pastMovie);
      const result = MoviePresenter.toUpcomingMovie(dto, fixedToday);

      expect(result.days_until_release).toBeNull();
      expect(result.upcoming_badge_label).toBeNull();
    });
  });

  describe("toHomeHeroList", () => {
    it("should mix and tag movies correctly", () => {
      const movie = createMovie();
      const dto = MovieMapper.toBffDto(movie);
      const upcoming = [MoviePresenter.toUpcomingMovie(dto, fixedToday)];
      const nowPlaying = [dto];
      const recentlyAdded = [dto];

      const result = MoviePresenter.toHomeHeroList(
        upcoming,
        nowPlaying,
        recentlyAdded,
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].category).toBeDefined();
    });
  });
});
