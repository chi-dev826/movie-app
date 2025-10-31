import { MovieDetailJson, MovieDetail, MovieJson, Movie } from "@/types/movie";
import { ImageJson } from "@/types/movie/imagesResponse";
import { VideoItemJson } from "@/types/movie/videos";
import { CollectionPart } from "@/types/collection";
import { DefaultResponse } from "@/types/common";
import { MovieWatchProvidersResponse } from "@/types/watch";
import { fetchVideoStatus } from "../lib/youtubeClient";

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

export const formatVideo = async (
  data: DefaultResponse<VideoItemJson>,
): Promise<string | null> => {
  const { results } = data;
  if (!results || results.length === 0) {
    return null;
  }

  const youtubeTrailers = results.filter(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  if (youtubeTrailers.length === 0) {
    return null;
  }

  for (const trailer of youtubeTrailers) {
    const videoStatus = await fetchVideoStatus(trailer.key);
    if (videoStatus && videoStatus.items && videoStatus.items.length > 0) {
      const status = videoStatus.items[0].status;
      if (status && status.privacyStatus === "public") {
        return trailer.key;
      }
    }
  }

  return null;
};

export const formatImage = (data: ImageJson) => {
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
        (p) =>
          p.provider_name !== "Amazon Prime Video with Ads" &&
          p.provider_name !== "Netflix Standard with Ads" &&
          p.provider_name !== "dAnime Amazon Channel" &&
          p.provider_name !== "Anime Times Amazon Channel",
      )
      .map((p) => ({
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
  movies: (MovieJson | CollectionPart)[],
  imageResponses: ImageJson[],
): Movie[] => {
  if (!movies || movies.length === 0) {
    return [];
  }

  return movies.map((movie, index) => {
    const formattedMovie = formatMovie(movie);
    const logos = imageResponses[index].logos;
    return {
      ...formattedMovie,
      logo_path: logos?.[0]?.file_path ?? null,
    };
  });
};
