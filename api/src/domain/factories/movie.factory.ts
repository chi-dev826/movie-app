import { MovieEntity } from "@/domain/models/movie";
import { MovieDetailEntity } from "@/domain/models/movieDetail";
import { Video } from "@/domain/models/video";
import {
  MovieResponse,
  MovieDetailResponse,
  VideoItem,
  MovieWatchProvidersResponse,
} from "@shared/types/external/tmdb";

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
      data.vote_average ? data.vote_average / 2 : null,
    );
  }

  static createFromDetailResponse(
    data: MovieDetailResponse,
  ): MovieDetailEntity {
    return new MovieDetailEntity(
      // Base properties
      data.id,
      data.title,
      data.original_title,
      data.original_language ?? "en",
      data.overview,
      data.poster_path,
      data.backdrop_path,
      data.release_date ?? null,
      data.vote_average ? data.vote_average / 2 : null,
      // Extended properties
      data.belongs_to_collection?.id ?? null,
      data.runtime,
      data.genres?.map((g) => g.name) ?? null,
      data.homepage,
      data.credits?.cast?.slice(0, 20).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
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
          profile_path: c.profile_path,
        })) ?? [],
      data.revenue,
      data.budget,
      data.production_countries?.map((c) => c.name) ?? [],
      data.production_companies?.[0]?.logo_path ?? null,
    );
  }

  static createVideo(item: VideoItem): Video {
    return new Video(item.key, item.site, item.type);
  }

  static createWatchProviders(
    data: MovieWatchProvidersResponse,
  ): { logo_path: string | null; name: string }[] {
    const regionalData = data.results["JP"];
    if (!regionalData) return [];
    return (
      regionalData.flatrate
        ?.filter(
          (p: { provider_name: string }) =>
            p.provider_name !== "Amazon Prime Video with Ads" &&
            p.provider_name !== "Netflix Standard with Ads" &&
            p.provider_name !== "dAnime Amazon Channel" &&
            p.provider_name !== "Anime Times Amazon Channel" &&
            p.provider_name !== "Apple TV Amazon Channel" &&
            p.provider_name !== "HBO Max on U-Next" &&
            p.provider_name !== "FOD Channel Amazon Channel",
        )
        .map((p: { logo_path: string | null; provider_name: string }) => ({
          logo_path: p.logo_path,
          name: p.provider_name,
        })) ?? []
    );
  }
}
