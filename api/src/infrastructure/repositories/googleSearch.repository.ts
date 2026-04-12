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
    const rawData = await this.cache.getOrSet(
      `serpApi:movieAnalysis:raw2:${query}`, // キャッシュキーを変更して古いデータを無効化
      async () => {
        const response = await serpApiClient.get<SerpApiResponse>("/search", {
          params: {
            q: query,
            filter: params?.filter,
          },
        });

        return response.data.organic_results || [];
      },
      CACHE_TTL.STANDARD,
    );

    return rawData.map((item: SerpApiOrganicResult) =>
      ArticleFactory.createFromSerpApi(item),
    );
  }
}
