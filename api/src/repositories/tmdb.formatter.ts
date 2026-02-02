import { MovieDetail, Movie } from "../../../shared/types/domain";
import {
  MovieDetailResponse,
  MovieResponse,
  ImageResponse,
} from "../../../shared/types/external/tmdb";
import { MovieWatchProvidersResponse } from "../../../shared/types/external/tmdb";

export class MovieFormatter {
  public formatMovie(movie: MovieResponse): Movie {
    return {
      id: movie.id,
      backdrop_path: movie.backdrop_path,
      original_title: movie.original_title,
      original_language: movie.original_language,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average:
        movie.vote_average == null || movie.vote_average === 0
          ? null
          : movie.vote_average / 2,
      release_date: movie.release_date ?? null,
    };
  }

  public formatDetail(data: MovieDetailResponse): MovieDetail {
    return {
      id: data.id,
      backdrop_path: data.backdrop_path,
      belongs_to_collection_id: data.belongs_to_collection?.id ?? null,
      original_title: data.original_title,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path,
      year: data.release_date ? parseInt(data.release_date.slice(0, 4)) : null,
      runtime: data.runtime,
      vote_average:
        data.vote_average == null || data.vote_average === 0
          ? null
          : data.vote_average / 2,
      genres: data.genres?.map((genre: { name: string }) => genre.name) ?? null,
      company_logo: data.production_companies?.[0]?.logo_path ?? null,
      homePageUrl: data.homepage,
      cast:
        data.credits?.cast?.slice(0, 20).map((c) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path,
        })) ?? [],
      crew:
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
      revenue: data.revenue,
      budget: data.budget,
      production_countries: data.production_countries?.map((c) => c.name) ?? [],
    };
  }

  public formatImage(data: ImageResponse): string | null {
    return data.logos?.[0]?.file_path ?? null;
  }

  public formatWatchProviders(
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

  public isMostlyJapanese(title: string, original_language: string): boolean {
    if (original_language !== "ja" && original_language !== "en") {
      return false;
    }
    const jpChars = title.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || [];
    const ratio = jpChars.length / title.length;
    return ratio > 0.3; // 30%以上が日本語なら日本語タイトルとみなす
  }

  public enrichMovieListWithLogos(
    movies: MovieResponse[],
    imageResponses: (ImageResponse | null)[],
  ): Movie[] {
    if (!movies || movies.length === 0) {
      return [];
    }

    return movies.map((movie, index) => {
      const formattedMovie = this.formatMovie(movie);
      const imageResponse = imageResponses[index];
      const logos = imageResponse?.logos;
      return {
        ...formattedMovie,
        logo_path: logos?.[0]?.file_path ?? null,
      };
    });
  }

  public formatMovieFromDetail(
    detail: MovieDetail,
    logoPath: string | null,
  ): Movie {
    return {
      id: detail.id,
      backdrop_path: detail.backdrop_path,
      original_title: detail.original_title,
      // 注: 現在のMovieDetailにはoriginal_languageが含まれていません。
      // カード表示用としてはクリティカルではないため、一旦 'en' をデフォルトとして設定します。
      original_language: "en",
      title: detail.title,
      poster_path: detail.poster_path,
      overview: detail.overview,
      vote_average: detail.vote_average,
      // 注: MovieDetailは 'year' (数値) を持ちますが、Movieは 'release_date' (文字列) を持ちます。
      release_date: detail.year ? `${detail.year}-01-01` : null,
      logo_path: logoPath,
    };
  }
}
