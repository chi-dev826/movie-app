import { ArticleEntity } from "../models/article.entity";
import { SerpApiOrganicResult } from "../../infrastructure/external/serpApi/response";
import { EXTERNAL_API_URLS } from "../../infrastructure/constants/external";

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
    // UI側での結合を不要にするため、ドメイン層でフルURLに構築する（境界防御）
    const fullUrl = `${EXTERNAL_API_URLS.EIGA_COM}${url}`;
    return new ArticleEntity(
      fullUrl,
      title,
      fullUrl,
      snippet,
      source,
      imageUrl,
    );
  }
}
