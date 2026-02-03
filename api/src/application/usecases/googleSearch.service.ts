import { GoogleSearchRepository } from "@/infrastructure/repositories/googleSearch.repository";
import { Article } from "@shared/types/domain";
import Nodecache from "node-cache";

export class GoogleSearchService {
  private readonly googleSearchRepository: GoogleSearchRepository;
  private readonly cache: Nodecache;

  constructor(googleSearchRepository: GoogleSearchRepository) {
    this.googleSearchRepository = googleSearchRepository;
    this.cache = new Nodecache({ stdTTL: 86400 }); // キャッシュの有効期限を24時間に設定
  }

  async getMovieAnalysis(movieTitle: string) {
    const query = `${movieTitle} 映画 考察`;
    const cacheKey = `movieAnalysis:${query}`;
    const cachedResult = this.cache.get<Article[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const results = await this.googleSearchRepository.searchMovieAnalysis({
      query,
      params: { num: 4, filter: 1 },
    });
    this.cache.set(cacheKey, results);
    return results;
  }
}

export default GoogleSearchService;
