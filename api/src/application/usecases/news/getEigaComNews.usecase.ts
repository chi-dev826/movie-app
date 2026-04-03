import { IEigaComRepository } from "../../../domain/repositories/eigaCom.repository.interface";
import { Article } from "../../../../../shared/types/api/dto";
import { ARTICLE_CONFIG } from "../../../domain/constants/article";

/**
 * 映画.comのニュースを映画タイトルで検索するユースケース
 *
 * @summary ユーザーが入力した映画タイトルを元に、映画.comのニュース検索を行い、
 * 関連するニュース記事を取得してDTOに変換して返却する。
 *
 * @example
 * const useCase = new GetEigaComNewsUseCase(eigaComRepo);
 * const news = await useCase.execute("Inception");
 * // => [{ id: "...", title: "Inception News", link: "https://...", ... }, ...]
 */
export class GetEigaComNewsUseCase {
  constructor(private readonly eigaComRepository: IEigaComRepository) {}

  async execute(movieTitle: string): Promise<Article[]> {
    const articles = await this.eigaComRepository.searchNews(movieTitle);
    return articles
      .slice(0, ARTICLE_CONFIG.MAX_DISPLAY_COUNT)
      .map((article) => article.toDto());
  }
}
