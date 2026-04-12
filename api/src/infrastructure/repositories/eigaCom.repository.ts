import { eigaComClient } from "../lib/eigaComClient";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { IEigaComRepository } from "../../domain/repositories/eigaCom.repository.interface";
import { ArticleEntity } from "../../domain/models/article.entity";
import { ArticleFactory } from "../../domain/factories/article.factory";
import { CACHE_TTL } from "../constants/cacheTtl";
import * as cheerio from "cheerio";

export class EigaComRepository implements IEigaComRepository {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly client: typeof eigaComClient = eigaComClient,
  ) {}

  async searchNews(movieTitle: string): Promise<ArticleEntity[]> {
    const rawData = await this.cache.getOrSet(
      `eigaCom:news:raw:${movieTitle}`,
      async () => {
        const searchUrl = `/search/${encodeURIComponent(movieTitle)}`;
        const response = await this.client.get(searchUrl);
        const $ = cheerio.load(response.data);

        const rawItems: { title: string; url: string; imageUrl: string | null; snippet: string; source: string }[] = [];
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
            rawItems.push({ title, url, imageUrl, snippet, source: "映画.com" });
          }
        });

        return rawItems;
      },
      CACHE_TTL.STANDARD,
    );

    return rawData.map(item => ArticleFactory.createFromScraping(item));
  }
}
