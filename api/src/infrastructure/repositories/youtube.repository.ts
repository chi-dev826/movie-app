import { getYoutubeApi } from "../lib/youtubeClient";
import { IYoutubeRepository } from "../../domain/repositories/youtube.repository.interface";
import { AxiosInstance } from "axios";

export class YoutubeRepository implements IYoutubeRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance = getYoutubeApi()) {
    this.api = api;
  }

  async getVideoStatus(key: string) {
    try {
      const response = await this.api.get("/videos", {
        params: {
          part: "status",
          id: key,
        },
      });

      const status = response.data?.items?.[0]?.status;
      return status?.privacyStatus === "public";
    } catch (error) {
      console.error("Error fetching video status from YouTube:", error);
      return false;
    }
  }
}
