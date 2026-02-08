import { Article as ArticleDTO } from "../../../../shared/types/domain";

/**
 * 外部ソースから取得した記事やコンテンツを表すドメインモデル。
 * 識別子（ID）を持ち、データの整合性を自己管理する。
 */
export class ArticleEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly link: string,
    public readonly snippet: string,
    public readonly source: string,
    public readonly imageUrl: string | null = null,
  ) {
    if (!title || title.trim() === "") {
      throw new Error("Article title is required and cannot be empty.");
    }

    // ランタイムでの不変性を強制
    Object.freeze(this);
  }

  /**
   * プレゼンテーション層や外部へ渡すためのDTO変換。
   */
  public toDto(): ArticleDTO {
    return {
      id: this.id,
      title: this.title,
      link: this.link,
      snippet: this.snippet,
      source: this.source,
      imageUrl: this.imageUrl,
    };
  }
}
