import { IGoogleSearchRepository } from "../../../domain/repositories/googleSearch.repository.interface";
import { Article } from "../../../../../shared/types/domain";
import { ArticleEnrichService } from "../../services/article.enrich.service";

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
        num: 4, // 考察記事の取得件数
        filter: 1, // SerpAPI: 類似結果の重複排除を有効化
      },
    });

    const enrichedArticles = await this.articleEnrichService.enrichArticles(
      articles,
    );

    return enrichedArticles.map((article) => article.toDto());
  }
}
