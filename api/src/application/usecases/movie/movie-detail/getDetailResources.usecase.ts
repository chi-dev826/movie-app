import { ITmdbRepository } from "../../../../domain/repositories/tmdb.repository.interface";
import { MovieEnrichService } from "../../../services/movie.enrich.service";
import { ResourcesResponse } from "../../../../../../shared/types/api/response";

export class GetDetailResourcesUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enrichService: MovieEnrichService,
  ) {}

  async execute(movieId: number): Promise<ResourcesResponse> {
    const [imagePath, watchProvidersRaw, videoInfo] = await Promise.all([
      this.tmdbRepo.getMovieImages(movieId),
      this.tmdbRepo.getMovieWatchProviders(movieId),
      this.enrichService.getDetailedVideos(movieId),
    ]);

    return {
      imagePath,
      watchProviders: watchProvidersRaw,
      videoInfo,
    };
  }
}
