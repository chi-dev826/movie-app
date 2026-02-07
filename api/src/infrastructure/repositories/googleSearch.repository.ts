import { serpApiClient } from "../lib/serpApi.client";
import {
  SerpApiResponse,
  SerpApiOrganicResult,
} from "../../../../shared/types/external/serpApi/response";
import { Article } from "../../../../shared/types/domain";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";

export class GoogleSearchRepository {
  constructor(private readonly cache: ICacheRepository) {}

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
    const cacheKey = `movieAnalysis:${query}`;
    const cachedResult = this.cache.get<Article[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const response = await serpApiClient.get<SerpApiResponse>("/search", {
        params: {
          q: query,
          num: params?.num,
          filter: params?.filter,
        },
      });

      const items = response.data.organic_results || [];
      const result: Article[] = items.map((item: SerpApiOrganicResult) => ({
        id: item.link,
        title: item.title,
        link: item.link,
        snippet: item.snippet || "",
        source: "Google Search",
        imageUrl: item.thumbnail || null,
      }));

      this.cache.set(cacheKey, result, 86400); // 24時間キャッシュ
      return result;
    } catch (error) {
      console.error("SerpApi search error:", error);
      return [];
    }
  }
}