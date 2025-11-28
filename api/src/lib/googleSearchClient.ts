import axios from "axios";
// import * as cheerio from "cheerio";
import dotenv from "dotenv";
import path from "path";
import { googleCustomSearchResponse } from "@/types/external/googleCustomSearch/response";
import { Article } from "@/types/domain";
import { EXTERNAL_API_URLS } from "@/constants/external";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const key = process.env.GOOGLE_CUSTOM_SEARCH_KEY;
const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX;

if (!key) {
  throw new Error(
    "Google Custom Search key is not defined. Please set GOOGLE_CUSTOM_SEARCH_KEY in your .env file.",
  );
}
if (!cx) {
  throw new Error(
    "Google Custom Search CX is not defined. Please set GOOGLE_CUSTOM_SEARCH_CX in your .env file.",
  );
}

export class googleSearchClient {
  private readonly baseUrl = EXTERNAL_API_URLS.GOOGLE_SEARCH;
  private readonly apiKey = key;
  private readonly searchEngineId = cx;

  constructor() {}

  async searchMovieAnalysis({
    query,
    params,
  }: {
    query: string | number;
    params?: {
      num?: number;
      filter?: number;
    };
  }): Promise<Article[]> {
    const searchUrl = `${this.baseUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(
      query,
    )}${params?.num ? `&num=${params.num}` : ""}${params?.filter ? `&filter=${params.filter}` : ""}`;

    try {
      const response = await axios.get(searchUrl);
      const items: googleCustomSearchResponse[] = response.data.items || [];
      const result: Article[] = items.map(
        (item: googleCustomSearchResponse) => ({
          id: item.cacheId,
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          source: "Google Custom Search",
          imageUrl: item.pagemap.cse_thumbnail?.[0]?.src || null,
          publishedAt: null,
        }),
      );

      return result;
    } catch (error) {
      console.error("Googleカスタム検索エラー:", error);
      return [];
    }
  }
}
