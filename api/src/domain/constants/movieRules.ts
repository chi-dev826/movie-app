import { DiscoverMovieParams } from "../../../../shared/types/external/tmdb";
import { TMDB_CONFIG } from "../constants/tmdbConfig";
import { SORT_OPTIONS } from "../../../../shared/types/external/tmdb/sortOptions";
import { RELEASE_TYPE } from "../../../../shared/types/external/tmdb/releaseType";

export const MOVIE_RULES = {
  UPCOMING: {
    region: TMDB_CONFIG.REGION,
    watch_region: TMDB_CONFIG.REGION,
    sort_by: SORT_OPTIONS.POPULARITY_DESC,
    include_adult: false,
    include_video: false,
    with_release_type: `${RELEASE_TYPE.THEATRICAL}|${RELEASE_TYPE.THEATRICAL_LIMITED}`,
  } satisfies DiscoverMovieParams,

  SEARCH_BY_PERSON: {
    sort_by: SORT_OPTIONS.POPULARITY_DESC,
    region: TMDB_CONFIG.REGION,
    "vote_count.gte": TMDB_CONFIG.FILTERS.MIN_VOTE_COUNT,
  } satisfies DiscoverMovieParams,
} as const;
