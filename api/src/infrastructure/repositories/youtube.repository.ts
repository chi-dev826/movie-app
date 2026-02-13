import { youtubeApi } from "../lib/youtubeClient";
import { YoutubeRepositoryInterface } from "../../domain/repositories/youtube.repository.interface";

export class YoutubeRepository implements YoutubeRepositoryInterface {
  private readonly api: typeof youtubeApi;

  constructor(api: typeof youtubeApi = youtubeApi) {
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
