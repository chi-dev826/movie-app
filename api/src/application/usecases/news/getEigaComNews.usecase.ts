import { EigaComRepository } from "@/infrastructure/repositories/eigaCom.repository";
import { Article } from "@shared/types/domain";

export class GetEigaComNewsUseCase {
  constructor(private readonly eigaComRepository: EigaComRepository) {}

  async execute(movieTitle: string): Promise<Article[]> {
    return this.eigaComRepository.searchNews(movieTitle);
  }
}
