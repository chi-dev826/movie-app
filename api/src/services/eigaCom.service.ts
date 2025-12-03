import NodeCache from "node-cache";
import { EigaComRepository } from "../repositories/eigaCom.repository";
import { Article } from "../../../shared/types/domain";

export class EigaComService {
  private readonly eigaComRepository: EigaComRepository;
  private readonly cache: NodeCache;

  constructor(eigaComRepository: EigaComRepository) {
    this.eigaComRepository = eigaComRepository;
    this.cache = new NodeCache({ stdTTL: 86400 }); // キャッシュの有効期限を24時間に設定
  }

  async getEigaComNews(movieTitle: string): Promise<Article[]> {
    const cacheKey = `eigaComNews:${movieTitle}`;
    const cachedResult = this.cache.get<Article[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const articles = await this.eigaComRepository.searchNews(movieTitle);
    this.cache.set(cacheKey, articles);
    return articles;
  }
}
