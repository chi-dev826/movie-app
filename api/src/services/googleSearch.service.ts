import { googleSearchClient } from "../lib/googleSearchClient";
import { Article } from "../../../shared/types/domain";
import Nodecache from "node-cache";

const cache = new Nodecache({ stdTTL: 86400 }); // キャッシュの有効期限を24時間に設定

export class GoogleSearchService {
  private googleSearchClient: googleSearchClient;

  constructor() {
    this.googleSearchClient = new googleSearchClient();
  }
  async getMovieAnalysis(movieTitle: string) {
    const query = `${movieTitle} 映画 考察`;
    const cacheKey = `movieAnalysis:${query}`;
    const cachedResult = cache.get<Article[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const results = await this.googleSearchClient.searchMovieAnalysis({
      query,
      params: { num: 4, filter: 1 },
    });
    cache.set(cacheKey, results);
    return results;
  }
}

export default GoogleSearchService;
