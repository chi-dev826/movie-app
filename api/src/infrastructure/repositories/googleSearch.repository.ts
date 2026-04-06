import { serpApiClient } from "../lib/serpApi.client";
import {
  SerpApiResponse,
  SerpApiOrganicResult,
} from "../external/serpApi/response";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { IGoogleSearchRepository } from "../../domain/repositories/googleSearch.repository.interface";
import { ArticleEntity } from "../../domain/models/article.entity";
import { ArticleFactory } from "../../domain/factories/article.factory";
import { CACHE_TTL } from "../constants/cacheTtl";

export class GoogleSearchRepository implements IGoogleSearchRepository {
  constructor(private readonly cache: ICacheRepository) {}

  async searchMovieAnalysis({
    query,
    params,
  }: {
    query: string | number;
    params?: {
      filter?: number;
    };
  }): Promise<ArticleEntity[]> {
    return this.cache.getOrSet(
      `serpApi:movieAnalysis:raw:${query}`,
      async () => {
        const response = await serpApiClient.get<SerpApiResponse>("/search", {
          params: {
            q: query,
            filter: params?.filter,
          },
        });

        const items = response.data.organic_results || [];

        return items.map((item: SerpApiOrganicResult) =>
          ArticleFactory.createFromSerpApi(item),
        );
      },
      CACHE_TTL.STANDARD,
    );
  }
}
