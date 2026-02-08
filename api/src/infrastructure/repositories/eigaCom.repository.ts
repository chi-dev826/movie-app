import { eigaComClient } from "../lib/eigaComClient";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { ArticleEntity } from "../../domain/models/article.entity";
import { ArticleFactory } from "../../domain/factories/article.factory";
import { Article } from "../../../../shared/types/domain";
import * as cheerio from "cheerio";

export class EigaComRepository {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly client: typeof eigaComClient = eigaComClient,
  ) {}

  async searchNews(movieTitle: string): Promise<ArticleEntity[]> {
    const cacheKey = `eigaComNews:${movieTitle}`;
    const cachedResult = this.cache.get<Article[]>(cacheKey);

    if (cachedResult) {
      return cachedResult.map(
        (item) =>
          new ArticleEntity(
            item.id,
            item.title,
            item.link,
            item.snippet,
            item.source,
            item.imageUrl,
          ),
      );
    }

    const searchUrl = `/search/${encodeURIComponent(movieTitle)}`;

    try {
      const response = await this.client.get(searchUrl);
      const $ = cheerio.load(response.data);

      const entities: ArticleEntity[] = [];
      $("#rslt-news .list-block").each((_, el) => {
        const element = $(el);
        const title = element.find("h3.title a").text().trim();
        const url = element.find("h3.title a").attr("href");
        const imageUrl = element.find(".img-thumb img").attr("src") || null;
        const snippet = element
          .find("p.txt")
          .text()
          .replace(/\s+/g, " ")
          .trim();

        if (title && url) {
          entities.push(
            ArticleFactory.createFromScraping({
              title,
              url,
              imageUrl,
              snippet,
              source: "映画.com",
            }),
          );
        }
      });

      this.cache.set(
        cacheKey,
        entities.map((e) => e.toDto()),
        86400,
      ); // 24時間キャッシュ

      return entities;
    } catch (error) {
      console.error("映画.comのニュース取得エラー:", error);
      return [];
    }
  }
}
