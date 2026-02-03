import { youtubeApi } from "@/infrastructure/lib/youtubeClient";

export class YoutubeRepository {
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
      return response.data;
    } catch (error) {
      console.error("Error fetching video status from YouTube:", error);
      return null;
    }
  }
}
