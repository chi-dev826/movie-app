/**
 * TMDB API 設定（定数および型定義）
 * 認識負荷を下げ、インポートを簡素化するために、TMDB 固有の定義をこのファイルに集約しています。
 *
 * 参考: https://developer.themoviedb.org/reference/discover-movie
 */

/**
 * Discover API 用のソートオプション
 */
export const SORT_OPTIONS = {
  ORIGINAL_TITLE_ASC: "original_title.asc",
  ORIGINAL_TITLE_DESC: "original_title.desc",
  POPULARITY_ASC: "popularity.asc",
  POPULARITY_DESC: "popularity.desc",
  REVENUE_ASC: "revenue.asc",
  REVENUE_DESC: "revenue.desc",
  PRIMARY_RELEASE_DATE_ASC: "primary_release_date.asc",
  PRIMARY_RELEASE_DATE_DESC: "primary_release_date.desc",
  TITLE_ASC: "title.asc",
  TITLE_DESC: "title.desc",
  VOTE_AVERAGE_ASC: "vote_average.asc",
  VOTE_AVERAGE_DESC: "vote_average.desc",
  VOTE_COUNT_ASC: "vote_count.asc",
  VOTE_COUNT_DESC: "vote_count.desc",
} as const;

export type SortOptionValue = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

/**
 * TMDB API で使用される主要な国コード
 */
export const TMDB_COUNTRY_CODES = {
  JP: "JP",
  US: "US",
  GB: "GB",
  KR: "KR",
  FR: "FR",
  DE: "DE",
  ES: "ES",
  IT: "IT",
  CA: "CA",
  AU: "AU",
} as const;

export type TmdbCountryCode =
  (typeof TMDB_COUNTRY_CODES)[keyof typeof TMDB_COUNTRY_CODES];

/**
 * Discover API 用の公開形態（リリースタイプ）
 */
export const RELEASE_TYPE = {
  PREMIERE: 1,
  THEATRICAL_LIMITED: 2,
  THEATRICAL: 3,
  DIGITAL: 4,
  PHYSICAL: 5,
  TV: 6,
} as const;

export type ReleaseTypeValue = (typeof RELEASE_TYPE)[keyof typeof RELEASE_TYPE];

/**
 * Discover Movie API のクエリパラメータ
 */
export interface DiscoverMovieParams {
  // 共通パラメータ
  language?: string; // 言語 (例: "ja-JP")
  region?: string; // リージョン (例: "JP")
  sort_by?: SortOptionValue; // 並び順
  page?: number; // ページ番号
  include_adult?: boolean; // アダルト作品を含むか
  include_video?: boolean; // ビデオ作品を含むか
  watch_region?: string; // 視聴地域 (例: "JP")
  with_watch_providers?: string; // ストリーミングサービス指定 (例: "8|9")

  // 日付関連フィルタ
  "primary_release_date.gte"?: string; // 指定日以降 (例: "2025-10-22")
  "primary_release_date.lte"?: string; // 指定日以前 (例: "2025-11-22")
  "release_date.gte"?: string;
  "release_date.lte"?: string;

  // コンテンツフィルタ
  with_genres?: string; // ジャンルID（例: "28,18"）
  with_original_language?: string; // オリジナル言語（例: "ja|en"）
  with_release_type?: string; // 公開形態（例: "2|3"）
  without_genres?: string; // 除外するジャンル
  without_keywords?: string; // 除外するキーワードID
  with_keywords?: string; // 含めるキーワードID

  // その他の高度なフィルタ
  with_runtime_gte?: number; // 最小上映時間
  with_runtime_lte?: number; // 最大上映時間
  vote_average_gte?: number; // 最小平均評価
  vote_average_lte?: number; // 最大平均評価
  vote_count_gte?: number; // 最小投票数
  vote_count_lte?: number; // 最大投票数
  with_companies?: string; // 制作会社ID
  with_cast?: string; // キャストID
  with_crew?: string; // スタッフID
  with_people?: string; // 出演/制作に関与した人物ID
  with_watch_monetization_types?: string; // 課金形態フィルタ（例: "flatrate|free"）

  // カスタムフィルタ（API拡張・独自用途）
  [key: string]: string | number | boolean | undefined;
}
