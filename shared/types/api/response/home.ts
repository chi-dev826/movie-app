import { Movie, UpcomingMovie, UpcomingMeta } from "../dto";
import { PaginatedResponse } from "./movie";

/** ヒーロースワイパーで使用するカテゴリ付き映画 */
export type HeroMovie = Movie &
  Partial<UpcomingMeta> & {
    readonly category: "upcoming" | "now_playing" | "recently_added";
  };

/** GET /api/home のレスポンス型 */
export type HomePageResponse = {
  readonly hero: HeroMovie[];
  readonly upcoming: PaginatedResponse<UpcomingMovie>;
  readonly nowPlaying: PaginatedResponse<Movie>;
  readonly recentlyAdded: PaginatedResponse<Movie>;
  readonly trending: PaginatedResponse<Movie>;
};
