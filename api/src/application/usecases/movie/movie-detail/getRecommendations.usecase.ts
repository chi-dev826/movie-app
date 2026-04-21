import { ITmdbRepository } from "../../../../domain/repositories/tmdb.repository.interface";
import { MovieRecommendationService } from "../../../../domain/services/movie.recommendation.service";
import { RecommendationsDomainData } from "../../../types/movie.types";

export class GetRecommendationsUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly recommendationService: MovieRecommendationService,
  ) {}

  async execute(
    movieId: number,
    collectionId: number | null,
  ): Promise<RecommendationsDomainData> {
    const [similarMovies, collection] = await Promise.all([
      this.tmdbRepo.getSimilarMovies(movieId),
      collectionId
        ? this.tmdbRepo.getCollection(collectionId)
        : Promise.resolve(null),
    ]);

    const recommendations = this.recommendationService.getRecommendations(
      movieId,
      collection,
      similarMovies,
    );

    return {
      recommendations,
    };
  }
}
