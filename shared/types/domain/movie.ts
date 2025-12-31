// アプリケーション内で使用する整形済みの映画カード情報
export type Movie = {
  id: number;
  backdrop_path: string | null;
  original_title: string;
  original_language: string;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number | null;
  logo_path?: string | null;
  video?: string | null;
  release_date?: string | null;
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
};

// アプリケーション内で使用する整形済みの映画詳細情報
export type MovieDetail = {
  id: number;
  backdrop_path: string | null;
  belongs_to_collection_id: number | null;
  original_title: string;
  title: string;
  overview: string;
  poster_path: string | null;
  year: number | null;
  runtime: number | null;
  vote_average: number | null;
  genres: string[] | null;
  company_logo: string | null;
  homePageUrl: string | null;
  cast: Cast[];
  crew: Crew[];
  revenue: number;
  budget: number;
  production_countries: string[];
};