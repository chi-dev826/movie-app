import { MovieEntity } from "../models/movie";
import { MovieDetailEntity } from "../models/movieDetail";
import { Video } from "../models/video";
import {
  MovieResponse,
  MovieDetailResponse,
  VideoItem,
  MovieWatchProvidersResponse,
  TrendingMovieResponse,
} from "../../infrastructure/external/tmdb";
import { EXCLUDED_PROVIDERS } from "../constants/watchProviders";

const excludedProviderSet = new Set<string>(EXCLUDED_PROVIDERS);

export class MovieFactory {
  static createFromApiResponse(data: MovieResponse): MovieEntity {
    return new MovieEntity(
      data.id,
      data.title,
      data.original_title,
      data.original_language,
      data.overview,
      data.poster_path,
      data.backdrop_path,
      data.release_date ?? null,
      data.vote_average ?? null,
      data.genre_ids ?? [],
    );
  }

  static createFromDetailResponse(
    data: MovieDetailResponse,
  ): MovieDetailEntity {
    const baseInfo = new MovieEntity(
      data.id,
      data.title,
      data.original_title,
      data.original_language ?? "en",
      data.overview,
      data.poster_path,
      data.backdrop_path,
      data.release_date ?? null,
      data.vote_average ?? null,
      data.genres?.map((g) => g.id) ?? [],
    );

    return new MovieDetailEntity(
      baseInfo,
      data.belongs_to_collection?.id ?? null,
      data.runtime,
      data.genres?.map((g) => g.name) ?? null,
      data.homepage,
      data.credits?.cast?.slice(0, 20).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })) ?? [],
      data.credits?.crew
        ?.filter(
          (c) =>
            c.job === "Director" ||
            c.job === "Screenplay" ||
            c.job === "Original Music Composer",
        )
        .map((c) => ({
          id: c.id,
          name: c.name,
          job: c.job,
          profilePath: c.profile_path,
        })) ?? [],
      data.revenue,
      data.budget,
      data.production_countries?.map((c) => c.name) ?? [],
      data.production_companies?.map((c) => c.name) ?? [],
      data.production_companies?.[0]?.logo_path ?? null,
    );
  }

  static createVideo(item: VideoItem): Video {
    return new Video(item.key, item.site, item.type);
  }

  static createWatchProviders(
    data: MovieWatchProvidersResponse,
  ): { logoPath: string | null; name: string }[] {
    const regionalData = data.results["JP"];
    if (!regionalData) return [];
    return (
      regionalData.flatrate
        ?.filter(
          (p: { provider_name: string }) =>
            !excludedProviderSet.has(p.provider_name),
        )
        .map((p: { logo_path: string | null; provider_name: string }) => ({
          logoPath: p.logo_path,
          name: p.provider_name,
        })) ?? []
    );
  }

  static createFromTrendingResponse(data: TrendingMovieResponse): MovieEntity {
    return new MovieEntity(
      data.id,
      data.title,
      data.original_title,
      data.original_language,
      data.overview,
      data.poster_path,
      data.backdrop_path,
      data.release_date ?? null,
      data.vote_average ?? null,
      data.genre_ids ?? [],
      data.media_type,
    );
  }
}
