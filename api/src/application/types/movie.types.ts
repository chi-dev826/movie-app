import { MovieEntity } from "../../domain/models/movie";

/**
 * UseCase層で生成される、ドメインエンティティ + 補助データの合成型。
 * logoPath / videoKey はTMDB APIから取得される表示用データであり、
 * ドメインの関心事ではないためEntityには含めず、この型で束ねる。
 */
export type EnrichedMovie = {
  readonly entity: MovieEntity;
  readonly logoPath: string | null;
  readonly videoKey: string | null;
};

export type RecommendationsDomainData = {
  recommendations: {
    title: string;
    movies: readonly MovieEntity[];
  };
};
