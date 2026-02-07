import { DiscoverMovieParams } from "../../../../shared/types/external/tmdb";
import { TMDB_CONFIG } from "../constants/tmdbConfig";
import { SORT_OPTIONS } from "../../../../shared/types/external/tmdb/sortOptions";

export const HOME_CATEGORIES: Record<string, DiscoverMovieParams> = {
  popular: {
    "vote_count.gte": TMDB_CONFIG.FILTERS.HOME.POPULAR_VOTE_COUNT,
    sort_by: SORT_OPTIONS.POPULARITY_DESC,
    region: TMDB_CONFIG.REGION,
  },
  recently_added: {
    "vote_count.gte": TMDB_CONFIG.FILTERS.HOME.RECENT_VOTE_COUNT,
    sort_by: SORT_OPTIONS.PRIMARY_RELEASE_DATE_DESC,
    region: TMDB_CONFIG.REGION,
  },
  top_rated: {
    "vote_count.gte": TMDB_CONFIG.FILTERS.HOME.TOP_RATED_VOTE_COUNT,
    sort_by: SORT_OPTIONS.VOTE_AVERAGE_DESC,
    region: TMDB_CONFIG.REGION,
  },
  high_rated: {
    "vote_count.gte": TMDB_CONFIG.FILTERS.HOME.HIGH_RATED_VOTE_COUNT,
    sort_by: SORT_OPTIONS.VOTE_COUNT_DESC,
    region: TMDB_CONFIG.REGION,
  },
};