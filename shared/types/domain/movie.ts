// アプリケーション内で使用する整形済みの映画カード情報
export type Movie = {
  readonly id: number;
  readonly backdrop_path: string | null;
  readonly original_title: string;
  readonly original_language: string;
  readonly title: string;
  readonly overview: string;
  readonly poster_path: string | null;
  readonly vote_average: number | null;
  readonly logo_path?: string | null;
  readonly video?: string | null;
  readonly release_date?: string | null;
};

export type Cast = {
  readonly id: number;
  readonly name: string;
  readonly character: string;
  readonly profile_path: string | null;
};

export type Crew = {
  readonly id: number;
  readonly name: string;
  readonly job: string;
  readonly profile_path: string | null;
};

export type Staff = {
  readonly id: number;
  readonly name: string;
};

export type keyStaff = {
  readonly directors: Staff[];
  readonly writers: Staff[];
  readonly composers: Staff[];
};

// アプリケーション内で使用する整形済みの映画詳細情報
export type MovieDetail = {
  readonly id: number;
  readonly backdrop_path: string | null;
  readonly belongs_to_collection_id: number | null;
  readonly original_title: string;
  readonly title: string;
  readonly overview: string;
  readonly poster_path: string | null;
  readonly year: number | null;
  readonly runtime: number | null;
  readonly vote_average: number | null;
  readonly genres: string[] | null;
  readonly company_logo: string | null;
  readonly homePageUrl: string | null;
  readonly keyStaff: keyStaff;
  readonly cast: Cast[];
  readonly revenue: number;
  readonly budget: number;
  readonly production_countries: string[];
};
