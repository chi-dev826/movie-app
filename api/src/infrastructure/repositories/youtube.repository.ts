import { getYoutubeApi } from "../lib/youtubeClient";
import { IYoutubeRepository } from "../../domain/repositories/youtube.repository.interface";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { CACHE_TTL } from "../../domain/constants/cacheTtl";
import { AxiosInstance } from "axios";

export class YoutubeRepository implements IYoutubeRepository {
  private readonly api: AxiosInstance;

  constructor(
    private readonly cache: ICacheRepository,
    api: AxiosInstance = getYoutubeApi(),
  ) {
    this.api = api;
  }

  async getVideoStatus(key: string): Promise<boolean> {
    return this.cache.getOrSet(
      `youtube:status:${key}`,
      async () => {
        try {
          const response = await this.api.get("/videos", {
            params: { part: "status", id: key },
          });
          const status = response.data?.items?.[0]?.status;
          return status?.privacyStatus === "public";
        } catch (error) {
          console.error("Error fetching video status from YouTube:", error);
          return false;
        }
      },
      CACHE_TTL.STANDARD,
    );
  }
}
