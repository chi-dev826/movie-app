import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { EXTERNAL_API_URLS } from "../constants/external";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error(
    "YouTube API key is not defined. Please set YOUTUBE_API_KEY in your .env file.",
  );
}

export const youtubeApi = axios.create({
  baseURL: EXTERNAL_API_URLS.YOUTUBE,
});

youtubeApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: YOUTUBE_API_KEY,
  };
  return config;
});

export const fetchVideoStatus = async (key: string) => {
  try {
    const response = await youtubeApi.get("/videos", {
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
};
