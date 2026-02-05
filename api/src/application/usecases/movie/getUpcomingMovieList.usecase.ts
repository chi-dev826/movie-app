import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { YoutubeRepository } from "@/infrastructure/repositories/youtube.repository";
import { Movie as MovieDTO } from "@shared/types/domain";
import { DiscoverMovieParams } from "@shared/types/external/tmdb";

import { ArrayUtils } from "@/utils/array";

export class GetUpcomingMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: YoutubeRepository,
  ) {}

  async execute(): Promise<MovieDTO[]> {
    const today = new Date();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const params: DiscoverMovieParams = {
      region: "JP",
      watch_region: "JP",
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      with_release_type: "3|2",
      "primary_release_date.gte": formatDate(today),
      "primary_release_date.lte": formatDate(twoMonthsLater),
    };

    const pagesToFetch = ArrayUtils.range(10);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getDiscoverMovies({ ...params, page }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res); // res is MovieEntity[]

    // 日本語コンテンツのフィルタリングを適用 (Entityのメソッドを使用)
    const filteredMovies = allMovies.filter((movie) =>
      movie.isMostlyJapanese(),
    );

    const moviesWithExtras = await Promise.all(
      filteredMovies.map(async (movie) => {
        const [image, videos] = await Promise.all([
          this.tmdbRepo.getMovieImages(movie.id),
          this.tmdbRepo.getMovieVideos(movie.id),
        ]);

        const trailerKey =
          videos.find((video) => video.isTrailer())?.key ?? null;

        let videoKey: string | null = null;
        if (trailerKey) {
          const isPublic = await this.youtubeRepo.getVideoStatus(trailerKey);
          if (isPublic) {
            videoKey = trailerKey;
          }
        }

        movie.setLogo(image);
        movie.setVideo(videoKey);

        return movie.toDto();
      }),
    );

    return moviesWithExtras;
  }
}
