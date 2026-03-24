// アプリケーション内で使用する汎用映画カード情報
export type Movie = {
  readonly id: number;
  readonly backdropPath: string | null;
  readonly originalTitle: string;
  readonly originalLanguage: string;
  readonly title: string;
  readonly overview: string;
  readonly posterPath: string | null;
  readonly voteAverage: number | null;
  readonly logoPath?: string | null;
  readonly video?: string | null;
  readonly releaseDate?: string | null;
  readonly genreIds?: number[];
};

// 公開予定映画向けの追加メタ情報
export type UpcomingMeta = {
  readonly releaseDateDisplay: string | null;
  readonly daysUntilRelease: number | null;
  readonly upcomingBadgeLabel: string | null;
  readonly releaseDateShort: string | null;
};

// 公開予定セクションなどで使用する映画カード情報
export type UpcomingMovie = Movie & UpcomingMeta;

export type Cast = {
  readonly id: number;
  readonly name: string;
  readonly character: string;
  readonly profilePath: string | null;
};

export type Crew = {
  readonly id: number;
  readonly name: string;
  readonly job: string;
  readonly profilePath: string | null;
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
  readonly backdropPath: string | null;
  readonly belongsToCollectionId: number | null;
  readonly originalTitle: string;
  readonly title: string;
  readonly overview: string;
  readonly posterPath: string | null;
  readonly year: number | null;
  readonly runtime: number | null;
  readonly voteAverage: number | null;
  readonly genres: string[] | null;
  readonly companyLogo: string | null;
  readonly homePageUrl: string | null;
  readonly keyStaff: keyStaff;
  readonly cast: Cast[];
  readonly revenue: number;
  readonly budget: number;
  readonly productionCountries: string[];
  readonly productionCompanies: string[];
  readonly releaseDate: string | null;
};

// 金額（円換算）関連のメタ情報
export type MoneyMeta = {
  readonly revenueJpyDisplay: string;
  readonly budgetJpyDisplay: string;
};

// UI表示用にバッジや整形済み文字列が付与された映画詳細情報
export type MovieDetail = MovieDetailBase & UpcomingMeta & MoneyMeta;
