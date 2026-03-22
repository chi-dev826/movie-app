import { Movie, UpcomingMovie, UpcomingMeta } from "../domain";

/** ヒーロースワイパーで使用するカテゴリ付き映画 */
export type HeroMovie = Movie &
  Partial<UpcomingMeta> & {
    readonly category: "upcoming" | "now_playing" | "recently_added";
  };

/** GET /api/home のレスポンス型 */
export type HomePageResponse = {
  readonly hero: HeroMovie[];
  readonly upcoming: UpcomingMovie[];
  readonly nowPlaying: Movie[];
  readonly popular: Movie[];
  readonly recentlyAdded: Movie[];
};
