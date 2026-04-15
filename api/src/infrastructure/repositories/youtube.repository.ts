import { getYoutubeApi } from "../lib/youtubeClient";
import { IYoutubeRepository } from "../../domain/repositories/youtube.repository.interface";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { CACHE_TTL } from "../constants/cacheTtl";
import { AxiosInstance } from "axios";

type YoutubeVideoStatus = {
  items: {
    id: string,
    status: {
      privacyStatus: string;
    };
  }[];
};

export class YoutubeRepository implements IYoutubeRepository {
  private readonly api: AxiosInstance;

  constructor(
    private readonly cache: ICacheRepository,
    api: AxiosInstance = getYoutubeApi(),
  ) {
    this.api = api;
  }

  async getPublicVideoKeys(keys: readonly string[]): Promise<string[]> {
    const keyString = [...keys].join(",");
    const cacheKey = `youtube:status:${keyString}`;

    return this.cache.getOrSet(
      cacheKey,
      async () => {
        try {
          const response = await this.api.get<YoutubeVideoStatus>("/videos", {
            params: { part: "status", id: keyString },
          });
          
          return response.data?.items?.filter((item) => item.status.privacyStatus === "public").map((item) => item.id) ?? [];
        } catch (error) {
          console.error("Error fetching video status from YouTube:", error);

          return [];
        }
      },
      CACHE_TTL.STANDARD,
    );
  }
}
