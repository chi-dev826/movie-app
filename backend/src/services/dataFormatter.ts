import { tmdbApi } from "../lib/tmdbClient";
import { youtubeApi } from "../lib/youtubeClient";
import { MovieDetailJson, MovieDetail, Movie, MovieJson } from "@/types/movie";
import { CollectionPart } from "@/types/collection";
import { DefaultResponse } from "@/types/common";
import { VideoItemJson } from "@/types/movie/videos";
import { ImagesJson } from "@/types/movie/imagesResponse";
import { MovieWatchProvidersResponse } from "@/types/watch";

// YouTube APIの型定義
interface YouTubeVideoStatus {
  id: string;
  status: {
    privacyStatus: "public" | "private" | "unlisted";
    embeddable: boolean;
  };
}

interface YouTubeVideosResponse {
  items: YouTubeVideoStatus[];
}

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

export const formatVideo = async (
  data: DefaultResponse<VideoItemJson>,
): Promise<string | null> => {
  const { results } = data;
  if (!results || results.length === 0) {
    return null;
  }

  const youtubeVideos = results;
  const officialTrailer = youtubeVideos.find(
    (video) => video.official && video.type === "Trailer",
  );
  const trailer = youtubeVideos.find((video) => video.type === "Trailer");
  const officialVideo = youtubeVideos.find((video) => video.official);

  const videoItems = [officialTrailer, trailer, officialVideo].filter(
    (v): v is VideoItemJson => !!v?.key,
  );

  const uniqueVideos = [...new Set(videoItems)];

  if (uniqueVideos.length === 0) {
    return null;
  }

  try {
    const response = await youtubeApi.get<YouTubeVideosResponse>("/videos", {
      params: {
        part: "status",
        id: uniqueVideos.map((v) => v.key).join(","),
      },
    });

    const publicVideos = new Set(
      response.data.items
        .filter(
          (item) =>
            item.status.privacyStatus === "public" && item.status.embeddable,
        )
        .map((item) => item.id),
    );

    for (const video of uniqueVideos) {
      if (publicVideos.has(video.key)) {
        return video.key;
      }
    }
  } catch (error) {
    console.error("Error fetching from YouTube API:", error);
    return null;
  }

  return null;
};

export const formatImage = (data: ImagesJson): string | null => {
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

// 映画リストにロゴ情報を付与する共通関数
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

export const isMostlyJapanese = (title: string): boolean => {
  const jpChars = title.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || [];
  const ratio = jpChars.length / title.length;
  return ratio > 0.3; // 30%以上が日本語なら日本語タイトルとみなす
};
