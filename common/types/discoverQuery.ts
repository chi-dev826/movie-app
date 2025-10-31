/**
 * TMDB Discover API のクエリパラメータ型定義
 * 参考: https://developer.themoviedb.org/reference/discover-movie
 */

export interface DiscoverMovieParams {
  // 共通パラメータ
  language?: string; // 言語 (例: "ja-JP")
  region?: string; // リージョン (例: "JP")
  sort_by?: string; // 並び順 (例: "popularity.desc")
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
