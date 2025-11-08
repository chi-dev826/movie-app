// アプリケーション内で使用する整形済みの映画カード情報
export type Movie = {
  id: number;
  backdrop_path: string | null;
  original_title: string;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  logo_path?: string | null;
  video?: string | null;
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
};
