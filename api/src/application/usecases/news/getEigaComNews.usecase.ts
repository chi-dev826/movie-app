import { EigaComRepository } from "../../../infrastructure/repositories/eigaCom.repository";
import { Article } from "../../../../../shared/types/domain";

export class GetEigaComNewsUseCase {
  constructor(private readonly eigaComRepository: EigaComRepository) {}

  async execute(movieTitle: string): Promise<Article[]> {
    const articles = await this.eigaComRepository.searchNews(movieTitle);
    return articles.map((article) => article.toDto());
  }
}
