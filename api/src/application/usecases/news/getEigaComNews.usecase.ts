import { EigaComRepository } from "../../../infrastructure/repositories/eigaCom.repository";
import { Article } from "../../../../../shared/types/domain";

/**
 * 映画.comのニュースを映画タイトルで検索するユースケース
 *
 * @description
 * ユーザーが入力した映画タイトルを元に、映画.comのニュース検索APIを呼び出し、関連するニュース記事を取得してDTOに変換して返却する。
 * 例: "Inception" → 映画.comのニュース検索 → 関連するニュース記事リスト
 *
 * @param {string} movieTitle - 検索する映画のタイトル（例: "Inception"）
 * @returns {Promise<Article[]>} 検索結果のニュース記事リスト
 *
 * @example
 * const useCase = new GetEigaComNewsUseCase(eigaComRepo);
 * const news = await useCase.execute("Inception");
 * console.log(news);
 * // 出力例: [{ id: 1, title: "Inception News", url: "https://...", ... }, ...]
 *
 * @process
 * 1. 映画タイトルを受け取る
 * 2. EigaComRepositoryのsearchNews()を呼び出して関連ニュースを取得
 * 3. 取得したニュース記事をArticle DTOに変換して返却
 *
 * @dependencies
 * - EigaComRepository: 映画.comのニュース検索APIとの通信を担当
 *
 * @error
 * - 映画.comのAPIからのデータ取得に失敗した場合は、エラーをキャッチしてログ出力し、空の配列を返却する（例: ネットワークエラーやAPIの障害が発生しても、ユーザーには空のニュースリストを返す）
 * - 取得したニュース記事のデータがビジネスルールに合わない場合は、該当記事を除外して処理を継続する（例: タイトルやURLが欠落している記事は除外する）
 */
export class GetEigaComNewsUseCase {
  constructor(private readonly eigaComRepository: EigaComRepository) {}

  async execute(movieTitle: string): Promise<Article[]> {
    const articles = await this.eigaComRepository.searchNews(movieTitle);
    return articles.map((article) => article.toDto());
  }
}
