import { IGoogleSearchRepository } from "../../../domain/repositories/googleSearch.repository.interface";
import { Article } from "../../../../../shared/types/api/dto";
import { ArticleEnrichService } from "../../services/article.enrich.service";
import { ARTICLE_CONFIG } from "../../../domain/constants/article";

export class GetMovieAnalysisUseCase {
  constructor(
    private readonly googleSearchRepository: IGoogleSearchRepository,
    private readonly articleEnrichService: ArticleEnrichService,
  ) {}
  async execute(movieTitle: string): Promise<Article[]> {
    const query = `${movieTitle} 映画 考察`;
    const articles = await this.googleSearchRepository.searchMovieAnalysis({
      query,
      params: {
        filter: 1, // SerpAPI: 類似結果の重複排除を有効化
      },
    });

    const enrichedArticles =
      await this.articleEnrichService.enrichArticles(articles);

    return enrichedArticles
      .slice(0, ARTICLE_CONFIG.MAX_DISPLAY_COUNT)
      .map((article) => article.toDto());
  }
}
