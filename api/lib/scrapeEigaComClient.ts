import axios from "axios";
import * as cheerio from "cheerio";
import NodeCache from "node-cache";
import { Article } from "@/types/domain";

export class ScrapeEigaComClient {
  private readonly BASE_URL = "https://eiga.com";
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 86400 }); // キャッシュの有効期限を24時間に設定
  }

  async searchNews(movieTitle: string): Promise<Article[]> {
    const searchUrl = `${this.BASE_URL}/search/${encodeURIComponent(
      movieTitle,
    )}`;

    try {
      if (this.cache.has(searchUrl)) {
        return this.cache.get<Article[]>(searchUrl) || [];
      }
      const response = await axios.get(searchUrl);
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
      this.cache.set(searchUrl, articles);
      return articles;
    } catch (error) {
      console.error("映画.comのニュース取得エラー:", error);
      return [];
    }
  }
}
