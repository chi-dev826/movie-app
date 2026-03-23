// アプリケーション内で使用する汎用映画カード情報
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
  readonly genre_ids?: number[];
};

// 公開予定映画向けの追加メタ情報
export type UpcomingMeta = {
  readonly release_date_display: string | null;
  readonly days_until_release: number | null;
  readonly upcoming_badge_label: string | null;
  readonly release_date_short: string | null;
};

// 公開予定セクションなどで使用する映画カード情報
export type UpcomingMovie = Movie & UpcomingMeta;

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

// アプリケーション内で使用する汎用の映画詳細情報 (装飾前)
export type MovieDetailBase = {
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
  readonly production_companies: string[];
  readonly release_date: string | null;
};

// 金額（円換算）関連のメタ情報
export type MoneyMeta = {
  readonly revenue_jpy_display: string;
  readonly budget_jpy_display: string;
};

// UI表示用にバッジや整形済み文字列が付与された映画詳細情報
export type MovieDetail = MovieDetailBase & UpcomingMeta & MoneyMeta;
