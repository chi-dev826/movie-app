import { Video } from "../models/video";
import { YoutubeRepositoryInterface } from "../repositories/youtube.repository.interface";

export class VideoDomainService {
  constructor(private readonly youtubeRepository: YoutubeRepositoryInterface) {}

  /**
   * 動画リストの中から、こう飽きされている予告編のキーを一つ特定する
   * その予告編が公開されていなければnullを返す
   */
  async getPublicTrailerKey(videos: Video[]): Promise<string | null> {
    const trailer = videos.find((v) => v.isTrailer());
    if (!trailer) return null;

    const isPublic = await this.youtubeRepository.getVideoStatus(trailer.key);
    return isPublic ? trailer.key : null;
  }
}