/**
 * スクレイピングによって取得されるニュース記事のデータ構造。
 */
export type NewsItem = {
  title: string;
  url: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  summary: string | null;
};
