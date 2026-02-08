import { serpApiClient } from "../lib/serpApi.client";
import {
  SerpApiResponse,
  SerpApiOrganicResult,
} from "../../../../shared/types/external/serpApi/response";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { ArticleEntity } from "../../domain/models/article.entity";
import { ArticleFactory } from "../../domain/factories/article.factory";
import { Article } from "../../../../shared/types/domain";

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
  }): Promise<ArticleEntity[]> {
    const cacheKey = `movieAnalysis:${query}`;
    const cachedResult = this.cache.get<Article[]>(cacheKey); // キャッシュはプレーンなオブジェクトとして保存されている想定

    if (cachedResult) {
      // キャッシュから復元する際もバリデーションを通すためEntity化する
      // ※簡易化のためDTO的なオブジェクトが保存されていると仮定
      return cachedResult.map(
        (item) =>
          new ArticleEntity(
            item.id,
            item.title,
            item.link,
            item.snippet,
            item.source,
            item.imageUrl,
          ),
      );
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
      const entities = items.map((item: SerpApiOrganicResult) =>
        ArticleFactory.createFromSerpApi(item),
      );

      // キャッシュにはDTO形式で保存
      this.cache.set(
        cacheKey,
        entities.map((e) => e.toDto()),
        86400,
      ); // 24時間キャッシュ

      return entities;
    } catch (error) {
      console.error("SerpApi search error:", error);
      return [];
    }
  }
}
