/**
 * アプリケーション内で扱う「記事」のドメインモデル。
 * ニュース、考察、レビューなど、外部から取得したコンテンツを表す。
 */
export type Article = {
  readonly id: string;
  readonly title: string;
  readonly link: string;
  readonly snippet: string;
  readonly source: string; // 'eiga.com', 'Google Search' などの出所
  readonly imageUrl?: string | null;
};
