import { ArticleEntity } from "../../domain/models/article.entity";
import { IOgpImageProvider } from "./ogp-image-provider.interface";

export class ArticleEnrichService {
  constructor(private readonly ogpImageProvider: IOgpImageProvider) {}

  /**
   * ArticleEntityに対してOGP画像が未設定の場合に補完を試みる。
   * SerpAPIのサムネイル不安定性を吸収するための戦略層。
   */
  async enrichArticles(articles: ArticleEntity[]): Promise<ArticleEntity[]> {
    const enrichedArticles = await Promise.all(
      articles.map(async (article) => {
        if (article.imageUrl) {
          return article;
        }

        const ogpImage = await this.ogpImageProvider.getOgpImage(article.link);
        if (!ogpImage) {
          return article;
        }

        return new ArticleEntity(
          article.id,
          article.title,
          article.link,
          article.snippet,
          article.source,
          ogpImage,
        );
      }),
    );

    return enrichedArticles;
  }
}
