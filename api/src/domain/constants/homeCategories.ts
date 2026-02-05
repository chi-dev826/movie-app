import { DiscoverMovieParams } from "@shared/types/external/tmdb";

export const HOME_CATEGORIES: Record<string, DiscoverMovieParams> = {
  popular: {
    "vote_count.gte": 10000,
    sort_by: "popularity.desc",
    region: "JP",
  },
  recently_added: {
    "vote_count.gte": 1000,
    sort_by: "primary_release_date.desc",
    region: "JP",
  },
  top_rated: {
    "vote_count.gte": 1000,
    sort_by: "vote_average.desc",
    region: "JP",
  },
  high_rated: {
    "vote_count.gte": 5000,
    sort_by: "vote_count.desc",
    region: "JP",
  },
};
