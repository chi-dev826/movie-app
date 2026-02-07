import axios from "axios";
import { EXTERNAL_API_URLS } from "../constants/external";

const API_KEY = process.env.SERP_API_KEY;

if (!API_KEY) {
  console.warn(
    "SerpApi API Key is not defined. Please set SERP_API_KEY in your .env file.",
  );
}

export const serpApiClient = axios.create({
  baseURL: EXTERNAL_API_URLS.SERP_API,
  params: {
    api_key: API_KEY,
    engine: "google",
    google_domain: "google.co.jp",
    gl: "jp",
    hl: "ja",
  },
});
