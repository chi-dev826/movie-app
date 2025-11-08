import axios from "axios";
import * as cheerio from "cheerio";
import { NewsItem } from "@/types/domain";

export class ScrapeEigaComClient {
  private readonly BASE_URL = "https://eiga.com";

  constructor() {}

  async searchNews(movieTitle: string): Promise<NewsItem[]> {
    const searchUrl = `${this.BASE_URL}/search/${encodeURIComponent(
      movieTitle,
    )}`;
    console.log("映画.comでニュースを検索中:", searchUrl);

    try {
      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      const newsItems: NewsItem[] = [];
      $("#rslt-news .list-block").each((_, el) => {
        const element = $(el);
        const title = element.find("h3.title a").text().trim();
        const url = element.find("h3.title a").attr("href");
        const thumbnailUrl = element.find(".img-thumb img").attr("src") || "";
        const summary = element
          .find("p.txt")
          .text()
          .replace(/\s+/g, " ")
          .trim();
        const publishedAt = element.find("small.time").text().trim();

        if (title && url) {
          newsItems.push({
            title,
            url,
            thumbnailUrl,
            publishedAt,
            summary,
          });
        }
      });
      console.log("取得したニュース件数:", newsItems.length);
      return newsItems;
    } catch (error) {
      console.error("映画.comのニュース取得エラー:", error);
      return [];
    }
  }
}
