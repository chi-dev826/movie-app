import { tmdbApi } from "../lib/tmdbClient";
import { MovieDetailJson, MovieDetail, Movie, MovieJson } from "@/types/movie";
import { CollectionPart } from "@/types/collection";
import { DefaultResponse } from "@/types/common";
import { VideoItemJson } from "@/types/movie/videos";
import { ImagesJson } from "@/types/movie/imagesResponse";
import { MovieWatchProvidersResponse } from "@/types/watch";

// === データ整形関数群 ===

export const formatMovie = (movie: MovieJson | CollectionPart): Movie => {
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

export const formatDetail = (data: MovieDetailJson): MovieDetail => {
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
    genres: data.genres?.map((genre) => genre.name) ?? null,
    company_logo: data.production_companies?.[0]?.logo_path ?? null,
    homePageUrl: data.homepage,
  };
};

export const formatVideo = (
  data: DefaultResponse<VideoItemJson>,
): string | null => {
  return (
    data.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    )?.key ?? null
  );
};

export const formatImage = (data: ImagesJson): string | null => {
  return data.logos?.[0]?.file_path ?? null;
};

export const formatWatchProviders = (
  data: MovieWatchProvidersResponse,
): string[] => {
  const regionalData = data.results["JP"];
  if (!regionalData) return [];
  return (
    regionalData.flatrate
      ?.filter((p) => p.provider_name !== "Amazon Prime Video with Ads")
      .map((p) => p.logo_path) ?? []
  );
};

// 映画リストにロゴ情報を付与し、スコアを整形する共通関数
export const enrichMovieList = async (
  movies: (MovieJson | CollectionPart)[],
): Promise<Movie[]> => {
  if (!movies || movies.length === 0) {
    return [];
  }

  const imagePromises = movies.map((movie) =>
    tmdbApi.get<ImagesJson>(`/movie/${movie.id}/images`, {
      params: { language: "ja" },
    }),
  );

  const imageResponses = await Promise.all(imagePromises);

  return movies.map((movie, index) => {
    const formattedMovie = formatMovie(movie);
    const logos = imageResponses[index].data.logos;
    return {
      ...formattedMovie,
      logo_path: logos?.[0]?.file_path ?? null,
    };
  });
};
