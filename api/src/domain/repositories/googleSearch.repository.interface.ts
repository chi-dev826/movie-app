import { ArticleEntity } from "../models/article.entity";

export interface IGoogleSearchRepository {
  searchMovieAnalysis(params: {
    query: string | number;
    params?: {
      num?: number;
      filter?: number;
    };
  }): Promise<ArticleEntity[]>;
}
