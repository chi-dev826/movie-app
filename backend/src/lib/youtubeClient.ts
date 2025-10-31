import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error(
    "YouTube API key is not defined. Please set YOUTUBE_API_KEY in your .env file.",
  );
}

export const youtubeApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
});

youtubeApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: YOUTUBE_API_KEY,
  };
  return config;
});

export const fetchVideoStatus = async (videoId: string) => {
  try {
    const response = await youtubeApi.get("/videos", {
      params: {
        part: "status",
        id: videoId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching video status from YouTube:", error);
    return null;
  }
};
