import { GoogleSearchRepository } from "../../../infrastructure/repositories/googleSearch.repository";
import { Article } from "../../../../../shared/types/domain";

export class GetMovieAnalysisUseCase {
  constructor(
    private readonly googleSearchRepository: GoogleSearchRepository,
  ) {}

  async execute(movieTitle: string): Promise<Article[]> {
    const query = `${movieTitle} 映画 考察`;
    const articles = await this.googleSearchRepository.searchMovieAnalysis({
      query,
      params: { num: 4, filter: 1 },
    });
    return articles.map((article) => article.toDto());
  }
}
