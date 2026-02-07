/**
 * アプリケーション内で扱う「記事」のドメインモデル。
 * ニュース、考察、レビューなど、外部から取得したコンテンツを表す。
 */
export type Article = {
  id: string;
  title: string;
  link: string;
  snippet: string;
  source: string; // 'eiga.com', 'Google Search' などの出所
  imageUrl?: string | null;
};
