import { eigaComClient } from "../lib/eigaComClient";
import { Article } from "../../../../shared/types/domain";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import * as cheerio from "cheerio";

export class EigaComRepository {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly client: typeof eigaComClient = eigaComClient,
  ) {}

  async searchNews(movieTitle: string): Promise<Article[]> {
    const cacheKey = `eigaComNews:${movieTitle}`;
    const cachedResult = this.cache.get<Article[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const searchUrl = `/search/${encodeURIComponent(movieTitle)}`;

    try {
      const response = await this.client.get(searchUrl);
      const $ = cheerio.load(response.data);

      const articles: Article[] = [];
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
        const publishedAt = element.find("small.time").text().trim();

        if (title && url) {
          articles.push({
            id: url, // URLをIDとして使用
            title,
            link: url,
            snippet,
            imageUrl,
            publishedAt,
            source: "映画.com", // ソースを明記
          });
        }
      });

      this.cache.set(cacheKey, articles, 86400); // 24時間キャッシュ
      return articles;
    } catch (error) {
      console.error("映画.comのニュース取得エラー:", error);
      return [];
    }
  }
}
