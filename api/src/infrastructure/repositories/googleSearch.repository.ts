import { serpApiClient } from "../lib/serpApi.client";
import {
  SerpApiResponse,
  SerpApiOrganicResult,
} from "../../../../shared/types/external/serpApi/response";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { IGoogleSearchRepository } from "../../domain/repositories/googleSearch.repository.interface";
import { ArticleEntity } from "../../domain/models/article.entity";
import { ArticleFactory } from "../../domain/factories/article.factory";
import { CACHE_TTL } from "../../domain/constants/cacheTtl";
import { OgpParser } from "../lib/ogp.parser";

export class GoogleSearchRepository implements IGoogleSearchRepository {
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
  }): Promise<ArticleEntity[]> {
    return this.cache.getOrSet(
      `serpApi:movieAnalysis:enriched:${query}`,
      async () => {
        const response = await serpApiClient.get<SerpApiResponse>("/search", {
          params: {
            q: query,
            num: params?.num,
            filter: params?.filter,
          },
        });

        const items = response.data.organic_results || [];

        // 並列（Promise.all）で各記事のOGP画像を補完
        const enrichedItems = await Promise.all(
          items.map(async (item: SerpApiOrganicResult) => {
            // すでにサムネイルがある場合はそれを使用
            if (item.thumbnail) return item;

            // ない場合はOGPを解析（失敗時はnullのまま）
            const ogpImage = await OgpParser.getOgpImage(item.link);
            return {
              ...item,
              thumbnail: ogpImage || undefined,
            };
          }),
        );

        return enrichedItems.map((item: SerpApiOrganicResult) =>
          ArticleFactory.createFromSerpApi(item),
        );
      },
      CACHE_TTL.STANDARD,
    );
  }
}
