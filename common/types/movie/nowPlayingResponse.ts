import { PaginatedResponse } from "../common";
import { MovieJson } from "../movie";

export type NowPlayingMovie = {
  dates: {
    maximum: string;
    minimum: string;
  };
} & PaginatedResponse<MovieJson>;
