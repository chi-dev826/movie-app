import { MovieDetail, Movie } from "@/types/domain";
import {
  MovieDetailResponse,
  MovieResponse,
  ImageResponse,
} from "@/types/external/tmdb";
import { MovieWatchProvidersResponse } from "@/types/external/tmdb";

export const formatMovie = (movie: MovieResponse): Movie => {
  return {
    id: movie.id,
    backdrop_path: movie.backdrop_path,
    original_title: movie.original_title,
    title: movie.title,
    poster_path: movie.poster_path,
    overview: movie.overview,
    vote_average: movie.vote_average / 2, // 10点満点を5点満点に変換
  };
};

export const formatDetail = (data: MovieDetailResponse): MovieDetail => {
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
    vote_average: data.vote_average / 2, // 10点満点を5点満点に変換
    genres: data.genres?.map((genre: { name: string }) => genre.name) ?? null,
    company_logo: data.production_companies?.[0]?.logo_path ?? null,
    homePageUrl: data.homepage,
  };
};

export const formatImage = (data: ImageResponse) => {
  return data.logos?.[0]?.file_path ?? null;
};

export const formatWatchProviders = (
  data: MovieWatchProvidersResponse,
): { logo_path: string | null; name: string }[] => {
  const regionalData = data.results["JP"];
  if (!regionalData) return [];
  return (
    regionalData.flatrate
      ?.filter(
        (p: { provider_name: string }) =>
          p.provider_name !== "Amazon Prime Video with Ads" &&
          p.provider_name !== "Netflix Standard with Ads" &&
          p.provider_name !== "dAnime Amazon Channel" &&
          p.provider_name !== "Anime Times Amazon Channel",
      )
      .map((p: { logo_path: string | null; provider_name: string }) => ({
        logo_path: p.logo_path,
        name: p.provider_name,
      })) ?? []
  );
};

export const isMostlyJapanese = (title: string): boolean => {
  const jpChars = title.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || [];
  const ratio = jpChars.length / title.length;
  return ratio > 0.3; // 30%以上が日本語なら日本語タイトルとみなす
};

export const enrichMovieListWithLogos = (
  movies: MovieResponse[],
  imageResponses: (ImageResponse | null)[],
): Movie[] => {
  if (!movies || movies.length === 0) {
    return [];
  }

  return movies.map((movie, index) => {
    const formattedMovie = formatMovie(movie);
    const imageResponse = imageResponses[index];
    const logos = imageResponse?.logos;
    return {
      ...formattedMovie,
      logo_path: logos?.[0]?.file_path ?? null,
    };
  });
};
