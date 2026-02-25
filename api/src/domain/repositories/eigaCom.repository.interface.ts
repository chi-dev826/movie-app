import { ArticleEntity } from "../models/article.entity";

export interface IEigaComRepository {
  searchNews(movieTitle: string): Promise<ArticleEntity[]>;
}
