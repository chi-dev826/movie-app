import { eigaComClient } from "../lib/eigaComClient";
import { Article } from "../../../shared/types/domain";
import * as cheerio from "cheerio";

export class EigaComRepository {
  private readonly client: typeof eigaComClient;

  constructor(client: typeof eigaComClient = eigaComClient) {
    this.client = client;
  }

  async searchNews(movieTitle: string): Promise<Article[]> {
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
      return articles;
    } catch (error) {
      console.error("映画.comのニュース取得エラー:", error);
      return [];
    }
  }
}
