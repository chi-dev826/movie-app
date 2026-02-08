import { ArticleEntity } from "../models/article.entity";
import { SerpApiOrganicResult } from "../../../../shared/types/external/serpApi/response";

/**
 * 外部データからArticleEntityを生成するためのファクトリクラス。
 * 変換ロジックを一元管理し、ドメインモデルの整合性を担保する。
 */
export class ArticleFactory {
  /**
   * SerpApiの検索結果（Organic Result）からArticleEntityを生成する。
   */
  public static createFromSerpApi(item: SerpApiOrganicResult): ArticleEntity {
    return new ArticleEntity(
      item.link, // IDとしてリンクを使用
      item.title,
      item.link,
      item.snippet || "",
      "Google Search",
      item.thumbnail || null,
    );
  }

  /**
   * 映画.comのスクレイピング結果からArticleEntityを生成する。
   */
  public static createFromScraping({
    title,
    url,
    imageUrl,
    snippet,
    source,
  }: {
    title: string;
    url: string;
    imageUrl: string | null;
    snippet: string;
    source: string;
  }): ArticleEntity {
    return new ArticleEntity(url, title, url, snippet, source, imageUrl);
  }
}
