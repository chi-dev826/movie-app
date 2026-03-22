import { MovieMapper } from "./movie.mapper";
import { MovieEntity } from "../../domain/models/movie";

describe("MovieMapper", () => {
  const createMovie = (overrides: Partial<MovieEntity> = {}): MovieEntity => {
    return new MovieEntity(
      overrides.id ?? 1,
      overrides.title ?? "テスト映画",
      overrides.originalTitle ?? "Test Movie",
      overrides.originalLanguage ?? "ja",
      overrides.overview ?? "概要です。",
      overrides.posterPath ?? "/poster.jpg",
      overrides.backdropPath ?? "/backdrop.jpg",
      overrides.releaseDate ?? "2024-01-01",
      overrides.voteAverage ?? 8.0,
      overrides.genreIds ?? [1, 2],
    );
  };

  describe("toBffDto (基本変換の検証)", () => {
    it("評価値が10段階から5段階に正しく変換されること", () => {
      const movie = createMovie({ voteAverage: 8.4 });
      const dto = MovieMapper.toBffDto(movie);
      expect(dto.vote_average).toBe(4.2);
    });

    it("オプションのビデオキーとロゴパスが反映されること", () => {
      const movie = createMovie();
      const dto = MovieMapper.toBffDto(movie, {
        videoKey: "video123",
        logoPath: "/logo.png",
      });
      expect(dto.video).toBe("video123");
      expect(dto.logo_path).toBe("/logo.png");
    });
  });

  describe("不変性の検証", () => {
    it("Entityの配列を変更しようとしてもDTOには影響しないこと (コピーされていること)", () => {
      const originalGenreIds = [1, 2];
      const movie = createMovie({ genreIds: originalGenreIds });
      const dto = MovieMapper.toBffDto(movie);

      // DTOの配列を変更してもEntityには影響しない
      if (dto.genre_ids) {
        dto.genre_ids.push(3);
      }
      expect(movie.genreIds).toEqual([1, 2]);
      expect(dto.genre_ids).toEqual([1, 2, 3]);
    });
  });
});
